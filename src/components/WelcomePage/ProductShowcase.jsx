import React, { useEffect, useRef } from "react";

const ProductShowcase = () => {
  const scrollRef = useRef(null);

  // Product array
  const products = [
    {
      id: 1,
      name: "Handmade Chitra artworks Mud",
      image:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSXm9H4Wex8X_3b4IdTMN7CYdO49FLXChy_n7pytWbKGqeGLpPn7yPulIle2O9YqPdkfufqepvv-W9Am2tpQ65_xtXTFKTild2JN827_IouCPwd6fFJnGNb",
    },
    {
      id: 2,
      name: "Wall Hanging",
      image:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSJ-JZjbiBrnChc7-AW3VOZAUj6Z8fv2trZMitIF17SxxwNxHN94fGAvSzUroajIJsVVdBgay5RBgU1syb4P1xZvZVb13ZGRcKc6q1MZW4",
    },
    {
      id: 3,
      name: "MANDALA LIPPAN ART",
      image: "https://m.media-amazon.com/images/I/71m5tZ1gwgL.jpg",
    },
    {
      id: 4,
      name: "Rema Fabtex Art",
      image:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRa0cg-mtedorJLt9JjZsD1vm-0a-P4KcpipahLxs9tyztkRMWl8oc6l-DFJP55ptxPtMtkk7mNiCaASzqDZqWcXZlVx72P8FJ41HTRCEGq",
    },
    {
      id: 5,
      name: "Indian clay painting",
      image:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTAjkwxxIX9z2Ui0oe4Nf4tsPZXTcOb5Vvl1GQZc7onpPpnYpyhDA_Fg2NTE6EciKaaTMHAqYc5l_IIIZ7y8AHfNMU8y1t0ZjvvndrrT0eB",
    },
    {
      id: 6,
      name: "Mud and mirror art",
      image:
        "https://i.pinimg.com/originals/83/ea/67/83ea67e9791cf295759bb72e6d85f846.jpg",
    },
  ];

  // Step: Extract image URLs and repeat multiple times for infinite scroll
  const repeatedImages = [...products, ...products, ...products];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const scrollSpeed = 1;
    const delay = 20;

    const scrollInterval = setInterval(() => {
      if (!scrollContainer) return;

      scrollContainer.scrollLeft += scrollSpeed;

      // Reset when nearing end to loop seamlessly
      if (
        scrollContainer.scrollLeft >=
        scrollContainer.scrollWidth - scrollContainer.clientWidth
      ) {
        scrollContainer.scrollLeft = 0;
      }
    }, delay);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className="w-full min-h-[20px] bg-white flex flex-col items-center justify-center font-montserrat">
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth"
      >
        <div className="flex gap-3 sm:gap-4 px-2">
          {repeatedImages.map((product, index) => (
            <img
              key={`${product.id}-${index}`}
              src={product.image}
              alt={product.name}
              className="rounded-md object-cover transition-transform duration-300 ease-in-out hover:scale-105
                w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
