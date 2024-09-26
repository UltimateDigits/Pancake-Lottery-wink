import React, { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web"; // Import react-spring for animation
import ThreeStars from "./assets/three-stars.png";
import StarBig from "./assets/star-big.png";
import StarSmall from "./assets/star-small.png";
import TicketLeft from "./assets/ticket-l.png";
import TicketRight from "./assets/ticket-r.png";
import HeaderLogo from "./assets/pancakelogo.png";
import TicketButton from "./assets/ticketbutton1.png";
import { motion } from "framer-motion";

import Wallet from "./components/Wallet";
import BuyBtn from "./components/BuyBtn";
import useCakePrice from "./hooks/useCakePrice";
import BigNumber from "bignumber.js";
import memoize from "lodash/memoize";
import { getCurrentLottery, getLotteryDetails } from "./integration";
import CustomButton from "./components/Wallet";

// Memoized functions for handling decimals
export const getFullDecimalMultiplier = memoize((decimals) => {
  return new BigNumber(10).pow(decimals);
});

export const getDecimalAmount = (amount, decimals = 18) => {
  return amount.times(getFullDecimalMultiplier(decimals));
};

export const getBalanceAmount = (amount, decimals = 18) => {
  return amount.dividedBy(getFullDecimalMultiplier(decimals));
};

export const getBalanceNumber = (balance, decimals = 18) => {
  return getBalanceAmount(balance || new BigNumber(0), decimals).toNumber();
};

const App = () => {
  const cakePriceBusd = useCakePrice({ enabled: true });
  const [priceVal, setPriceVal] = useState<number>(0); // Use number for priceVal
  const [cakePrice, setCakePrice] = useState<number>(0);
  const [discountDivisorval, setDiscountDivisorval] = useState(BigNumber(0));
  const [lotteryID, setLotteryID] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string>(""); // Error state

  // Animation for priceVal using react-spring
  const { number: animatedPrice } = useSpring({
    from: { number: 0 }, // Start the animation from 0
    number: priceVal, // Animate to the actual value of priceVal
    delay: 200, // Optional delay
    config: { tension: 100, friction: 40 }, // Adjust the speed and smoothness of the animation
  });

  const getVal = async () => {
    setLoading(true);
    setError(""); // Reset error on new fetch
    try {
      const res = await getCurrentLottery();
      const id = res.toString();
      setLotteryID(id);
      const amount = await getLotteryDetails(id);
      const amountCollectedInCake = amount["amountCollectedInCake"];
      const priceTicketInCake = amount["priceTicketInCake"];
      const discountDivisor = amount["discountDivisor"];

      setDiscountDivisorval(discountDivisor);

      const convertedValueofPrice = parseFloat(
        (Number(priceTicketInCake) / 1e18).toFixed(2)
      );
      setCakePrice(convertedValueofPrice);

      const prizeInBusd = amountCollectedInCake * cakePriceBusd;
      const rawValue = prizeInBusd / 1e18; // Calculate the number value
      setPriceVal(rawValue); // Set the number value for animation
    } catch (error) {
      console.log("Error fetching lottery data:", error);
      setError("Failed to load lottery data. Please try again."); // Set error message
    } finally {
      setLoading(false); // Set loading to false regardless of success or error
    }
  };

  useEffect(() => {
    getVal();
  }, [cakePriceBusd]);

  return (
    <div className="bg-gradient-radial from-[#A881FC] to-[#5F39AA] bg-center bg-cover flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center text-white max-w-[600px] relative">
        <div className="space-y-3">
          <img className="h-12 mx-auto" src={HeaderLogo} alt="Header Logo" />
          <CustomButton />
        </div>
        <div className="relative mt-5 w-[500px] text-center">
          <p className="font-bold text-xl">The Pancake Swap Lottery</p>
          <div className="flex flex-col justify-center items-center">
            {loading ? ( // Conditional rendering based on loading state
              <div className=" space-y-8">
                <p className="text-[#FEC61F] text-3xl font-bold">
                  Tickets on Sale Soon
                </p>
                <div className="relative ticket-main">
                  <img
                    className="h-16 mx-auto"
                    src={TicketButton}
                    alt="Lottery Ticket"
                  />
                  <button className="absolute inset-0 flex justify-center gap-1 items-center bg-white text-slate-500 text-xs font-bold h-10 w-44 rounded-full mx-auto my-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    On sales soon
                  </button>
                </div>
              </div>
            ) : error ? ( // Conditional rendering based on error state
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                {/* Animated Price Value */}
                <p className="text-[#FEC61F] font-bold text-3xl flex items-center">
                  $
                  <animated.span className="text-[#FEC61F] font-bold text-3xl">
                    {animatedPrice.to((n) =>
                      n.toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })
                    )}
                  </animated.span>
                </p>
                <p className="font-bold">in Prizes!</p>
              </>
            )}
          </div>
          <div className="my-6">
            {!loading &&
              !error && ( // Only show button if not loading and no error
                <BuyBtn
                  price={cakePrice}
                  discount={discountDivisorval}
                  lotteryId={lotteryID}
                />
              )}
          </div>

          {/* Animated Stars and Tickets */}
          <img
            className="absolute left-10 top-0 h-12 star-left"
            src={StarSmall}
            alt="Star"
          />
          <img
            className="absolute right-0 top-0 h-20 star-right"
            src={ThreeStars}
            alt="Three Stars"
          />
          <img
            className="absolute left-0 top-12 h-20 star-right"
            src={StarBig}
            alt="Big Star"
          />
          <img
            className="absolute left-5 bottom-0 h-20 ticket-left"
            src={TicketLeft}
            alt="Left Ticket"
          />
          <img
            className="absolute right-10 bottom-0 h-20 ticket-right"
            src={TicketRight}
            alt="Right Ticket"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
