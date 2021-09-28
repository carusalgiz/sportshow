export default function ({ redirect, app }) {
  // If the user is not authenticated
  if (app.$cookies.get('user') == null) {
    return redirect('/admin')
  } else {
    const user = app.$cookies.get('user');
    if (!user.is_staff) {
      return redirect('/admin')
    }
  }

}
