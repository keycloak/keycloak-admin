import React from "react";
import { render } from "@testing-library/react";

import { HelpItem } from "../HelpItem";

describe("<HelpItem />", () => {
  it("render", () => {
    const comp = render(<HelpItem item="storybook" itemFor="" />);
    expect(comp.asFragment()).toMatchSnapshot();
  });
});
