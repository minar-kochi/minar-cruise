import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import React from "react";

interface BaseProps {
  colorRepresentation: {
    colorRepresentationContent?: string;
    colorRepresentationContentClassName?: string;
  };

  previewMessage: {
    previewMessageContentClassName?: string;
    previewMessageContent?: string;
  };
}

type ConditionalTooltips =
  | {
      enableTooltip?: false;
      toolTipIcon?: never;
      toolTip?: {
        toolTipContent?: never;
        toolTipContentClassName?: never;
      };
    }
  | {
      enableTooltip: true;
      toolTipIcon?: JSX.Element;
      toolTip: {
        toolTipContent: string;
        toolTipContentClassName: string;
      };
    };

type TInfoRepresentationContainer = BaseProps & ConditionalTooltips;
export default function InfoRepresentationContainer({
  enableTooltip = false,
  toolTipIcon,
  toolTip,
  previewMessage: { previewMessageContent, previewMessageContentClassName },
  colorRepresentation: {
    colorRepresentationContent,
    colorRepresentationContentClassName,
  },
}: TInfoRepresentationContainer) {
  return (
    <div className="flex flex-wrap items-center px-3">
      <p
        className={cn(
          "bg-muted px-2 py-1 rounded-md mx-1 text-sm",
          colorRepresentationContentClassName,
        )}
      >
        {colorRepresentationContent}
      </p>{" "}
      <p
        className={cn(
          "text-sm text-muted-foreground flex",
          previewMessageContentClassName,
        )}
      >
        {previewMessageContent}
        {enableTooltip ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger>
                {toolTipIcon ?? <Info className="h-4 w-4 ml-1" />}
              </TooltipTrigger>
              <TooltipContent>
                <p className={cn("max-w-[250px]", toolTip?.toolTipContentClassName)}>
                  {toolTip?.toolTipContent}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </p>
    </div>
  );
}
