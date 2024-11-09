import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Heart,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import Image from "next/image";
import React from "react";

type SliderProps = {
  className?: string;
};

const Player = ({ className }: SliderProps) => {
  return (
    <div className={cn(className, "flex justify-between h-32 sm:h-20 px-4 py-2 rounded-md gap-10 items-start bg-primary/5 backdrop-blur-sm")}>
      <div className="flex items-center gap-4 w-fit">
        <Image
          src={
            "https://c.saavncdn.com/620/Aankhon-Se-Batana-Hindi-2022-20220526142609-500x500.jpg"
          }
          alt=""
          width={50}
          height={50}
          className={"rounded-md"}
        />
        <div className="hidden lg:flex flex-col justify-center w-40 pr-10">
          <h3 className="font-bold truncate">Aankhon Se Batana</h3>
          <p className="text-xs text-secondary-foreground truncate w-[60%]">
            Dikshant, Yash Jadhav
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center w-fit gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span>0:00</span>
          <Slider
            defaultValue={[50]}
            max={100}
            step={0.000001}
            className="w-28 md:w-40 lg:w-[14rem] xl:w-[25rem]"
          />
          <span>3:34</span>
        </div>
        <div className="col-start-2 justify-self-center flex items-center sm:flex-row flex-col justify-normal gap-2">
          <div className="flex gap-2">
          <div className="bg-primary/5 p-2 rounded-full text-primary cursor-pointer">
            <SkipBack className="size-4 lg:size-6" />
          </div>
          <div className="bg-primary/5 p-2 rounded-full text-primary cursor-pointer">
            {"play" === "play" ? <Pause className="text-primary size-4 lg:size-6" /> : <Play className="size-4 lg:size-6" />}
          </div>
          <div className="bg-primary/5 p-2 rounded-full text-primary cursor-pointer">
            <SkipForward  className="size-4 lg:size-6"/>
          </div>
          <div className="bg-primary/5 p-2 rounded-full cursor-pointer">
            {"isLoop" === "isLoop" ? (
              <Repeat1 className="text-primary size-4 lg:size-6" />
            ) : "forwd" === "forwd" ? (
              <Shuffle className="text-primary size-4 lg:size-6" />
            ) : (
              <Repeat className="text-primary size-4 lg:size-6" />
            )}
          </div>
          </div>
          <div className="sm:hidden flex gap-2 items-start justify-center">
        <div className="text-primary cursor-pointer text-[0.55rem] leading-[0.5rem] flex flex-col gap-2 items-center justify-center">
          <span className="bg-primary/5 p-2 rounded-full ">
            <Heart className="size-4 lg:size-6" />
          </span>{" "}
          <span>1M</span>
        </div>
        <div className="bg-primary/5 p-2 rounded-full text-primary cursor-pointer">
          <ListMusic className="size-4 lg:size-6" />
        </div>
      </div>
        </div>
      </div>
      <div className="hidden sm:flex gap-2 items-start justify-center">
        <div className="text-primary cursor-pointer text-[0.55rem] leading-[0.5rem] flex flex-col gap-2 items-center justify-center">
          <span className="bg-primary/5 p-2 rounded-full ">
            <Heart className="size-4 lg:size-6" />
          </span>{" "}
          <span>1M</span>
        </div>
        <div className="bg-primary/5 p-2 rounded-full text-primary cursor-pointer">
          <ListMusic className="size-4 lg:size-6" />
        </div>
      </div>
    </div>
  );
};

export default Player;
