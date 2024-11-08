import { Button } from "../ui/button";
import ContactForm from "./ContactForm";
import InputBox from "./InputBox";

const ContactMessageCard = () => {
  return (
    <article className="mt-20">
      <h2 className="font-bold text-3xl ">Leave a message</h2>
      <div className="">
        <p className="text-slate-500">
          We really appreciate you taking the time to get in touch. Please fill
          in the form below.
        </p>
        <ContactForm />
      </div>
    </article>
  );
};

export default ContactMessageCard;
