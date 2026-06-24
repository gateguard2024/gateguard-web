import { redirect } from 'next/navigation';

// The marketing site no longer hosts its own login. There is ONE sign-in, in the
// portal (portal.gateguard.co), which routes users to the right place by role.
export default function Login() {
  redirect('https://portal.gateguard.co');
}
