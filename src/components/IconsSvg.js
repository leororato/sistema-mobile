import Svg, { G, Path } from "react-native-svg";

export function IconKeyboard({width, height, sx}) {
  return (
      <Svg
        width={width}
        height={height}
        viewBox="0 0 48 48"
      >
        <G fill="none">
          <Path
            fill="#2f88ff"
            stroke="#000"
            stroke-linejoin="round"
            stroke-width="4"
            d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
          />
          <Path
            fill="#fff"
            fill-rule="evenodd"
            d="M15 19C16.3807 19 17.5 17.8807 17.5 16.5C17.5 15.1193 16.3807 14 15 14C13.6193 14 12.5 15.1193 12.5 16.5C12.5 17.8807 13.6193 19 15 19Z"
            clip-rule="evenodd"
          />
          <Path
            fill="#fff"
            fill-rule="evenodd"
            d="M15 27C16.3807 27 17.5 25.8807 17.5 24.5C17.5 23.1193 16.3807 22 15 22C13.6193 22 12.5 23.1193 12.5 24.5C12.5 25.8807 13.6193 27 15 27Z"
            clip-rule="evenodd"
          />
          <Path
            fill="#fff"
            fill-rule="evenodd"
            d="M24 19C25.3807 19 26.5 17.8807 26.5 16.5C26.5 15.1193 25.3807 14 24 14C22.6193 14 21.5 15.1193 21.5 16.5C21.5 17.8807 22.6193 19 24 19Z"
            clip-rule="evenodd"
          />
          <Path
            fill="#fff"
            fill-rule="evenodd"
            d="M24 27C25.3807 27 26.5 25.8807 26.5 24.5C26.5 23.1193 25.3807 22 24 22C22.6193 22 21.5 23.1193 21.5 24.5C21.5 25.8807 22.6193 27 24 27Z"
            clip-rule="evenodd"
          />
          <Path
            fill="#fff"
            fill-rule="evenodd"
            d="M33 19C34.3807 19 35.5 17.8807 35.5 16.5C35.5 15.1193 34.3807 14 33 14C31.6193 14 30.5 15.1193 30.5 16.5C30.5 17.8807 31.6193 19 33 19Z"
            clip-rule="evenodd"
          />
          <Path
            fill="#fff"
            fill-rule="evenodd"
            d="M33 27C34.3807 27 35.5 25.8807 35.5 24.5C35.5 23.1193 34.3807 22 33 22C31.6193 22 30.5 23.1193 30.5 24.5C30.5 25.8807 31.6193 27 33 27Z"
            clip-rule="evenodd"
          />
          <Path
            stroke="#fff"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="4"
            d="M17 33H31"
          />
        </G>
      </Svg>
  );
};

export function IconQrCode({ width, height }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Path fill="#000" d="M1 1h10v10H1zm2 2v6h6V3z" />
      <Path fill="#000" fillRule="evenodd" d="M5 5h2v2H5z" />
      <Path fill="#000" d="M13 1h10v10H13zm2 2v6h6V3z" />
      <Path fill="#000" fillRule="evenodd" d="M17 5h2v2h-2z" />
      <Path fill="#000" d="M1 13h10v10H1zm2 2v6h6v-6z" />
      <Path fill="#000" fillRule="evenodd" d="M5 17h2v2H5z" />
      <Path fill="#000" d="M23 19h-4v4h-6V13h1h-1v6h2v2h2v-6h-2v-2h-1h3v2h2v2h2v-4h2zm0 2v2h-2v-2z" />
    </Svg>
  )
};