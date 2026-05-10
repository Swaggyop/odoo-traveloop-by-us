function PlaceholderPage({ title, description }) {
  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-10 shadow-sm">

      <h1 className="text-5xl font-bold text-stone-900">
        {title}
      </h1>

      <p className="text-stone-500 text-lg mt-4 max-w-2xl">
        {description}
      </p>

      <div className="mt-10 bg-stone-100 rounded-3xl h-75 flex items-center justify-center">

        <span className="text-stone-400 text-lg">
          Feature module under development
        </span>

      </div>

    </div>
  );
}

export default PlaceholderPage;