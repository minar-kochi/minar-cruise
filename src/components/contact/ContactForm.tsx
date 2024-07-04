"use client";

import { Button } from "../ui/button";
import InputBox from "./InputBox";

const ContactForm = () => {
  return (
    <form>
      <InputBox  as={"input"} label="Your Name *"  props={{
        required: true,
        
      }}  />
      <InputBox label="Your Phone *" />
      <InputBox label="Your Email *" />
      <InputBox label="Your message (optional)" as={"textarea"} className="h-[200px]"/>
      <Button>Submit</Button>
    </form>
  );
};

export default ContactForm;
