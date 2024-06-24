import {Facebook, Instagram, Twitch}  from "lucide-react";
import { Button } from "../ui/button";

const SocialCard = () => {
  return <>
    <div className="flex justify-end space-x-3 py-5">
      <Button>
        <Facebook/>
      </Button>
      <Button>
        <Instagram/>
      </Button>
      <Button>
        <Twitch/>
      </Button>
    </div>
  </>
};

export default SocialCard;
