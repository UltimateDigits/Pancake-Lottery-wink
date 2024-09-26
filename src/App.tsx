import React, { useEffect, useState } from "react";
import ThreeStars from "./assets/three-stars.png";
import StarBig from "./assets/star-big.png";
import StarSmall from "./assets/star-small.png";
import TicketLeft from "./assets/ticket-l.png";
import TicketRight from "./assets/ticket-r.png";
import HeaderLogo from "./assets/pancakelogo.png";
import Wallet from "./components/Wallet";
import BuyBtn from "./components/BuyBtn.tsx";
import useCakePrice from "./hooks/useCakePrice";
import BigNumber from 'bignumber.js';
import memoize from 'lodash/memoize';
import { getCurrentLottery, getLotteryDetails } from "./integration";

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
  const [priceVal, setPriceVal] = useState("");
  const [cakePrice, setCakePrice] = useState(0);
  const [discountDivisorval, setDiscountDivisorval] = useState(BigNumber(0));



const [lotteryID, setLotteryID] = useState("")
  console.log("cake",cakePriceBusd);


  const getVal = async () => {
    try {
      const res = await getCurrentLottery();
      const id = res.toString();
      setLotteryID(id)
      const amount = await getLotteryDetails(id);
      const amountCollectedInCake = amount["amountCollectedInCake"];
      const priceTicketInCake = amount["priceTicketInCake"];
      const discountDivisor = amount["discountDivisor"];
      
      setDiscountDivisorval(discountDivisor);

      const convertedValueofPrice = parseFloat((Number(priceTicketInCake) / 1e18).toFixed(2));
      setCakePrice(convertedValueofPrice);

      const prizeInBusd = amountCollectedInCake * cakePriceBusd;
      const formattedValue = (prizeInBusd / 1e18).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      setPriceVal(formattedValue);
    } catch (error) {
      console.log("Error fetching lottery data:", error);
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
          <Wallet />
        </div>
        <div className="relative mt-5 w-[500px] text-center">
          <p className="font-bold text-xl">The pancake swap lottery</p>
          <div className="flex flex-col justify-center items-center">
            <p className="text-[#FEC61F] font-bold text-3xl">
              ${priceVal}
            </p>
            <p className="font-bold">in Prizes!</p>
          </div>
          <div className="my-6">
            <BuyBtn price={cakePrice} discount={discountDivisorval} lotteryId={lotteryID} />
          </div>

          {/* Animated Stars and Tickets */}
          <img className="absolute left-10 top-0 h-12 star-left" src={StarSmall} alt="" />
          <img className="absolute right-0 top-0 h-20 star-right" src={ThreeStars} alt="" />
          <img className="absolute left-0 top-12 h-20 star-right" src={StarBig} alt="" />
          <img className="absolute left-5 bottom-0 h-20 ticket-left" src={TicketLeft} alt="" />
          <img className="absolute right-10 bottom-0 h-20 ticket-right" src={TicketRight} alt="" />
        </div>
      </div>
    </div>
  );
};

export default App;
