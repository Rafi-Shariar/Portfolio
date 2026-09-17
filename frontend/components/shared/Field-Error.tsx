export function FieldError({ errors }: { errors: any[] }) {
  if (!errors || errors.length === 0) return null;

  return (
    <p className="text-xs font-medium text-red-500 mt-1">
      {typeof errors[0] === "string" ? errors[0] : errors[0]?.message}
    </p>
  );
}
