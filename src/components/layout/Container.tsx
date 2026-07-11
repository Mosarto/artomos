import { forwardRef, type ComponentPropsWithoutRef } from "react";

export type ContainerProps = ComponentPropsWithoutRef<"div">;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={["artomos-container", className].filter(Boolean).join(" ")}
      {...props}
    />
  ),
);

Container.displayName = "Container";

export default Container;
