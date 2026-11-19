import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote } from 'lucide-react';
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Amina",
    country: "Kenya",
    treatment: "Knee replacement",
    city: "Delhi NCR",
    stars: 5,
    quote:
      "My coordinator sorted the visa letter, airport pickup and a hotel ten minutes from the hospital. I was walking with support on day two.",
  },
  {
    id: 2,
    name: "Tahmid",
    country: "Bangladesh",
    treatment: "Cardiac bypass (CABG)",
    city: "Bengaluru",
    stars: 5,
    quote:
      "We compared three hospitals side by side before deciding. The quote we were given at the start is what we paid at discharge.",
  },
  {
    id: 3,
    name: "Grace",
    country: "Nigeria",
    treatment: "IVF",
    city: "Pune",
    stars: 4,
    quote:
      "Clear explanations at every step and a doctor who answered my WhatsApp messages. The long stay was easier with a serviced apartment nearby.",
  },
  {
    id: 4,
    name: "Bekzod",
    country: "Uzbekistan",
    treatment: "Spine surgery",
    city: "Delhi NCR",
    stars: 5,
    quote:
      "A Russian-speaking interpreter was with us for every consultation. That alone made the trip possible for my father.",
  },
  {
    id: 5,
    name: "Nimali",
    country: "Sri Lanka",
    treatment: "Cataract surgery",
    city: "Bengaluru",
    stars: 5,
    quote:
      "Surgery in the morning, back at the hotel by evening. Follow-up was done over video once I was home.",
  },
  {
    id: 6,
    name: "Hassan",
    country: "Oman",
    treatment: "Hip replacement",
    city: "Pune",
    stars: 4,
    quote:
      "Physiotherapy started the day after surgery and the team shared a home exercise plan before I flew back.",
  },
];

const ClientsReview = () => {
  return (
    <section className="bg-[#ECF1FF] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-[#283841]">
            What Our{" "}
            <span className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] bg-clip-text text-transparent">
              Patients Say
            </span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Experiences shared by patients who travelled to India for treatment with MedNDI.
          </p>
        </div>

        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4 md:-ml-6 py-4">
            {testimonials.map((t) => (
              <CarouselItem key={t.id} className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3">
                <figure className="h-full bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <Quote className="w-8 h-8 text-[#3252DF]/20" aria-hidden="true" />
                    <div className="flex items-center gap-0.5" aria-label={`${t.stars} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <FaStar
                          key={index}
                          className={`w-4 h-4 ${index < t.stars ? "text-[#DABE29]" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <blockquote className="flex-1 text-gray-700 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div
                      className="w-11 h-11 rounded-full bg-gradient-to-br from-[#3252DF] to-[#4466ff] text-white font-semibold flex items-center justify-center shrink-0"
                      aria-hidden="true"
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">
                        {t.name}, <span className="font-normal text-gray-600">{t.country}</span>
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {t.treatment} · {t.city}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex justify-center gap-3">
            <CarouselPrevious className="static translate-y-0 h-10 w-10 border-[#3252DF]/30 text-[#3252DF] hover:bg-white" />
            <CarouselNext className="static translate-y-0 h-10 w-10 border-[#3252DF]/30 text-[#3252DF] hover:bg-white" />
          </div>
        </Carousel>
        <p className="mt-6 text-center text-xs text-gray-500">
          Names shortened to protect patient privacy.
        </p>
      </div>
    </section>
  )
}

export default ClientsReview
