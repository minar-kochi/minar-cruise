
function GuestLabel({ label, desc }: { label: string; desc: string }) {
    return (
      <section className="border-b border-slate-300 mx-4 py-4">
        <article className="flex w-full">
          <div className="w-full space-y-1">
            <h4 className="font-semibold ">{label}</h4>
            <p className="text-muted-foreground text-sm">{desc}</p>
          </div>
          <div className="w-full flex justify-end items-center">number</div>
        </article>
      </section>
    );
  }

export default GuestLabel