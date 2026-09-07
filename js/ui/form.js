/**
 * form.js — contact form submission.
 *
 * The site is static (GitHub Pages), so the form posts to Web3Forms, which
 * relays the message to the configured inbox without a backend.
 *
 * ---------------------------------------------------------------------------
 * TO ACTIVATE: put your free access key in ACCESS_KEY below.
 * Get one in 30 seconds at https://web3forms.com — enter the destination
 * email, and the key arrives by mail. Nothing else needs to change.
 * ---------------------------------------------------------------------------
 *
 * Until a key is set, the form degrades gracefully: it composes the same
 * message as a mailto: link so no visitor ever hits a dead end.
 */

import { t } from '../i18n.js';

const ACCESS_KEY = 'YOUR-WEB3FORMS-ACCESS-KEY';
const ENDPOINT = 'https://api.web3forms.com/submit';
const MAILTO = 'mohannad.muhana@gmail.com';

const isConfigured = () => ACCESS_KEY && !ACCESS_KEY.startsWith('YOUR-');

function setNote(note, key, state) {
  if (!note) return;
  note.textContent = t(key);
  note.dataset.state = state;
}

/** No-backend fallback: hand the message to the visitor's mail client. */
function mailtoFallback(data) {
  const subject = `[malkawi.site] ${data.subject || 'Project enquiry'}`;
  const body = `${data.message}\n\n—\n${data.name}\n${data.email}`;
  window.location.href =
    `mailto:${MAILTO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const note = form.querySelector('.form__note');
  const submit = form.querySelector('[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.reportValidity()) return;

    const fd = new FormData(form);

    // Honeypot: real people never fill a field they cannot see.
    if (fd.get('botcheck')) return;

    const data = Object.fromEntries(fd.entries());

    if (!isConfigured()) {
      setNote(note, 'contact.form.mailto', 'ok');
      mailtoFallback(data);
      return;
    }

    const original = submit.innerHTML;
    submit.disabled = true;
    submit.textContent = t('contact.form.sending');
    setNote(note, 'contact.form.sending', '');

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `[malkawi.site] ${data.subject || 'Project enquiry'}`,
          from_name: data.name,
          ...data,
        }),
      });

      const out = await res.json().catch(() => ({}));

      if (res.ok && out.success !== false) {
        form.reset();
        setNote(note, 'contact.form.sent', 'ok');
      } else {
        throw new Error(out.message || `HTTP ${res.status}`);
      }
    } catch (err) {
      console.error('Contact form:', err);
      setNote(note, 'contact.form.failed', 'error');
    } finally {
      submit.disabled = false;
      submit.innerHTML = original;
    }
  });
}
