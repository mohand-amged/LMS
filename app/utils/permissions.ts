export function isPrivilegedTeacher(user: { email: string; role?: string } | null | undefined): boolean {
  if (!user) return false;
  const allowed = process.env.NEXT_PUBLIC_ALLOWED_TEACHER_EMAIL || 'teacher@example.com';
  // role check is optional here since the ask is "one email has access"
  return user.email?.toLowerCase() === allowed.toLowerCase();
}

