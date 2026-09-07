/**
 * form.js — contact form submission.
 *
 * The site is static (GitHub Pages), so the form posts to Web3Forms, which
 * relays the message to the configured inbox without a backend.
 *
 * The access key below is not a secret. A Web3Forms access key is designed to
 * ship in client-side code: it only identifies which inbox to deliver to, and
 * cannot be used to read submissions or change the account. Rotate it at
 * web3forms.com if it ever attracts spam.
 *
 * If the key is ever cleared, the form degrades rather than breaking: it
 * composes the same message as a mailto: link so no visitor hits a dead end.
 */

import { t } from '../i18n.js';

const ACCESS_KEY = 'bff8deff-d882-4e6d-8dd6-bee17677acb5';
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
        // The form fields go in first and the computed values override them.
        // The other order lets an empty `subject` field blank out the
        // prefixed subject line, and a filled one drop the prefix entirely.
        body: JSON.stringify({
          ...data,
          access_key: ACCESS_KEY,
          from_name: data.name,
          subject: `[malkawi.site] ${data.subject || 'Project enquiry'}`,
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
