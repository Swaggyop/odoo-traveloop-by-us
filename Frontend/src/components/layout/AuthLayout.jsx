function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-6">

      <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] overflow-hidden shadow-xl max-w-6xl w-full">

        {/* Left Section */}
        <div className="bg-teal-600 text-white p-14 flex flex-col justify-between">

          <div>

            <h1 className="text-5xl font-bold leading-tight">
              Intelligent Travel Planning Starts Here.
            </h1>

            <p className="mt-6 text-teal-50 text-lg leading-relaxed">
              Organize journeys, optimize budgets and manage experiences through elegant AI-powered workflows.
            </p>

          </div>

          <div className="mt-10">

            <div className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-sm">

              <p className="text-lg leading-relaxed">
                “Traveloop transformed the way we manage collaborative travel experiences.”
              </p>

              <div className="mt-5">
                <h4 className="font-semibold">
                  Olivia Bennett
                </h4>

                <p className="text-sm text-teal-100">
                  Travel Operations Lead
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Right Section */}
        <div className="p-10 lg:p-14 flex items-center">

          <div className="w-full">
            {children}
          </div>

        </div>

      </div>

    </div>
  );
}

export default AuthLayout;