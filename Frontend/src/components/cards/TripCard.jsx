import { CalendarDays, MapPin } from "lucide-react";

function TripCard({
  image,
  title,
  country,
  date,
  budget,
}) {
  return (
    <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">

      {/* Cover Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-44 object-cover"
      />

      {/* Content */}
      <div className="p-5">

        {/* Title */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-stone-900">
            {title}
          </h3>

          <div className="flex items-center gap-2 text-stone-500 mt-1">
            <MapPin size={16} />
            <span className="text-sm">{country}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2 text-stone-500">
            <CalendarDays size={16} />
            <span className="text-sm">{date}</span>
          </div>

          <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-xl text-sm font-medium">
            ₹{budget}
          </div>

        </div>
      </div>
    </div>
  );
}

export default TripCard;