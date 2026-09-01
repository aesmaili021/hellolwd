"use client";

export function DeleteButton({
  action,
  id,
  label = "Delete",
}: {
  action: (form: FormData) => void | Promise<void>;
  id: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm("Delete this item?")) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="cursor-pointer text-[13px] font-bold text-accent hover:underline"
      >
        {label}
      </button>
    </form>
  );
}
