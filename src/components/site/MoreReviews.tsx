import abdulHaq from "@/assets/proof/text-abdul-haq.jpg.asset.json";
import ahmadMunir from "@/assets/proof/text-ahmad-munir.jpg.asset.json";
import alii from "@/assets/proof/text-alii.jpg.asset.json";
import amazingWorthy from "@/assets/proof/text-amazing-worthy.jpg.asset.json";
import chavid from "@/assets/proof/text-chavid.jpg.asset.json";
import danish from "@/assets/proof/text-danish.jpg.asset.json";
import drAmnah from "@/assets/proof/text-dr-amnah.jpg.asset.json";
import drManalCrop from "@/assets/proof/text-dr-manal-crop.jpg.asset.json";
import drManalFull from "@/assets/proof/text-dr-manal-full.jpg.asset.json";
import khalid from "@/assets/proof/text-khalid.jpg.asset.json";
import patientJourney from "@/assets/proof/text-patient-journey.jpg.asset.json";
import socialAds from "@/assets/proof/text-social-ads.jpg.asset.json";
import tanveerHr from "@/assets/proof/text-tanveer-hr.jpg.asset.json";
import tanveer from "@/assets/proof/text-tanveer.jpg.asset.json";
import thankyou from "@/assets/proof/text-thankyou.jpg.asset.json";

const REVIEWS = [
  abdulHaq, ahmadMunir, alii, amazingWorthy, chavid,
  danish, drAmnah, drManalCrop, drManalFull, khalid,
  patientJourney, socialAds, tanveerHr, tanveer, thankyou,
];

export function MoreReviews() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            More Real Reviews From <span className="text-primary">Masterclass Attendees</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Unfiltered WhatsApp messages from doctors who joined and got results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {REVIEWS.map((img, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden bg-card border border-border shadow-md hover:shadow-xl transition-shadow"
            >
              <img
                src={img.url}
                alt={`Doctor testimonial ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-auto block"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
