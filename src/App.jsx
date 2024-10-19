import React, { useEffect } from "react";
import ThreeStars from "./assets/three-stars.png";
import StarBig from "./assets/star-big.png";
import StarSmall from "./assets/star-small.png";
import TicketLeft from "./assets/ticket-l.png";
import TicketRight from "./assets/ticket-r.png";
import HeaderLogo from "./assets/pancakelogo.png";
import Wallet from "./components/Wallet";
import BuyBtn from "./components/BuyBtn";
import { analytics } from '../firebase';
import { logEvent } from "firebase/analytics";

const App = () => {
  //log event
  useEffect(() => {
    logEvent(analytics, 'app_open', {
      appName: "Pancake Lottery Wink",
      openTime: new Date().toISOString(),
    })
  }, [])

  return (
    <div className="bg-gradient-radial from-[#A881FC] to-[#5F39AA] bg-center bg-cover flex justify-center items-center min-h-screen inter-font">
      <div className="flex flex-col justify-center items-center mx-auto min-h-screen text-white max-w-[600px] relative">
        <div className="">
        <div className="flex justify-center">
          <div className="space-y-3">
            <img className="h-12 mx-auto" src={HeaderLogo} alt="Header Logo" />
            <Wallet />
          </div>
        </div>
        <div className="relative mt-5 w-[500px]">
          <p className="font-bold text-xl text-center">
            The pancake swap lottery
          </p>
          <div className="flex flex-col justify-center items-center">
            <p className="text-[#FEC61F] font-bold text-3xl text-center">
              {" "}
              $35,672
            </p>
            <p className="font-bold">in Prizes!</p>
          </div>
          <div className="my-6">
            <BuyBtn />
          </div>

          <img className="absolute left-10 top-0 h-12 star-left" src={StarSmall} alt="" />
          <img className="absolute right-0 top-0 h-20 star-right" src={ThreeStars} alt="" />
          <img className="absolute left-0 top-12 h-20 star-right" src={StarBig} alt="" />
          <img className="absolute left-5 bottom-0 h-20 ticket-left" src={TicketLeft} alt="" />
          <img className="absolute right-10 bottom-0 h-20 ticket-right" src={TicketRight} alt="" />
        </div>
      </div>
      </div>
    </div>
  );
};

export default App;
