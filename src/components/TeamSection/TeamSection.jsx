import React, { useEffect, useRef, useState } from "react";

const TeamSection = () => {
  const teamMembers = [
    { name: "Manali Tomar", role: "Creative Director" },
    { name: "Rahul Sharma", role: "Lead Developer" },
    { name: "Subham Sharma", role: "Marketing Manager" },
  ];

  const containerRef = useRef(null);
  const [index, setIndex] = useState(0);

  // Auto-scroll logic for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % teamMembers.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [teamMembers.length]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: containerRef.current.offsetWidth * index,
        behavior: "smooth",
      });
    }
  }, [index]);

  return (
    <section className="py-14 px-6 max-w-full mx-auto font-montserrat">
      <h2 className="text-3xl font-bold text-[#004080] text-center mb-8 uppercase">
        Meet Our Team
      </h2>

      {/* Mobile scroll container */}
      <div
        className="flex md:hidden overflow-x-auto scroll-smooth transition-all duration-500 snap-x snap-mandatory"
        ref={containerRef}
      >
        {teamMembers.map((member, idx) => (
          <div key={idx} className="min-w-full flex-shrink-0 snap-center px-4">
            <div className="bg-gray-50 p-6 w-full max-w-xs mx-auto rounded-xl shadow hover:shadow-lg transition-all text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#004080] text-white flex items-center justify-center text-2xl font-bold mb-4">
                {member.name[0]}
              </div>
              <h3 className="text-xl font-semibold text-[#004080]">
                {member.name}
              </h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-wrap justify-center gap-8">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            className="bg-gray-50 p-6 w-64 rounded-xl shadow hover:shadow-lg transition-all text-center"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-[#004080] text-white flex items-center justify-center text-2xl font-bold mb-4">
              {member.name[0]}
            </div>
            <h3 className="text-xl font-semibold text-[#004080]">
              {member.name}
            </h3>
            <p className="text-gray-600">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
