import PhoneDisplay from "@/components/PhoneDisplay";
import phone1 from "../../../public/phone1.png";
import card1 from "../../../public/card1.png";

export default function DemoSection() {
  return (
    <div className="">
      <PhoneDisplay
        phoneImage={phone1}
        overlayCards={[
          {
            src: card1,
            alt: "Apply Card",
            style: {
              bottom: "150px", // Higher above phone
              left: "38%",
             
               // Optional: wider card if needed
              height: "auto",  // Let height auto-adjust
            },
          },
        ]}
      />
    </div>
  );
}
