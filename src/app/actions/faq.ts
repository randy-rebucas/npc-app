import connect from "@/lib/db";
import Faq from "../models/Faq";

export async function getFaqs() {
    connect();
    const faqs = await Faq.find({}).exec();
    return faqs;
}
  