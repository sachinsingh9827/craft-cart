import React from "react";

const NotFound = () => {
  const goBack = () => {
    window.history.back();
  };

  const goToHomepage = () => {
    window.location.href = "/";
  };

  return (
    <div>
      <style>
        {`
          @import 'https://fonts.googleapis.com/css?family=Inconsolata';

          html {
            min-height: 100%;
          }

          body {
            box-sizing: border-box;
            height: 100%;
            background-color: #000000;
            background-image: radial-gradient(#111111, #050505), url("https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif");
            background-repeat: no-repeat;
            background-size: cover;
            font-family: 'Inconsolata', Helvetica, sans-serif;
            font-size: 1.5rem;
            color: rgba(255, 255, 255, 0.8);
            text-shadow:
              0 0 1ex rgba(255, 255, 255, 1),
              0 0 2px rgba(0, 0, 0, 0.8);
          }

          .noise {
            pointer-events: none;
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: url("https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif");
            background-repeat: no-repeat;
            background-size: cover;
            z-index: -1;
            opacity: .02;
          }

          .overlay {
            pointer-events: none;
            position: absolute;
            width: 100%;
            height: 100%;
            background:
              repeating-linear-gradient(
              180deg,
              rgba(0, 0, 0, 0) 0,
              rgba(0, 0, 0, 0.3) 50%,
              rgba(0, 0, 0, 0) 100%);
            background-size: auto 4px;
            z-index: 1;
          }

          .overlay::before {
            content: "";
            pointer-events: none;
            position: absolute;
            display: block;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            background-image: linear-gradient(
              0deg,
              transparent 0%,
              rgba(255, 255, 255, 0.2) 2%,
              rgba(255, 255, 255, 0.8) 3%,
              rgba(255, 255, 255, 0.2) 3%,
              transparent 100%);
            background-repeat: no-repeat;
            animation: scan 7.5s linear 0s infinite;
          }

          @keyframes scan {
            0%        { background-position: 0 -100vh; }
            35%, 100% { background-position: 0 100vh; }
          }

          .terminal {
            box-sizing: inherit;
            position: absolute;
            height: 100%;
            width: 1000px;
            max-width: 100%;
            padding: 4rem;
            text-transform: uppercase;
          }

          .output {
            color: rgba(255, 255, 255, 0.8);
            text-shadow:
              0 0 1px rgba(255, 255, 255, 0.4),
              0 0 2px rgba(0, 0, 0, 0.8);
          }

          .output::before {
            content: "> ";
          }

          .errorcode {
            color: white;
          }

          .link-button {
            background: none;
            border: none;
            padding: 0;
            font: inherit;
            color: #0ff;
            cursor: pointer;
            text-decoration: none;
            margin: 0 4px;
          }

          .link-button::before {
            content: "[";
          }

          .link-button::after {
            content: "]";
          }

          .link-button:focus {
            outline: 2px dashed #0ff;
            outline-offset: 2px;
          }
        `}
      </style>

      {/* Noise and overlay effects */}
      <div className="noise"></div>
      <div className="overlay"></div>

      {/* Terminal-style layout */}
      <div className="terminal">
        <h1>
          Oops! <span className="errorcode">404</span> - Page Not Found
        </h1>
        <p className="output">
          It seems you've ventured into uncharted territory. The page you are
          looking for is either missing or lost in cyberspace.
        </p>
        <p className="output">
          Don't worry, you can either{" "}
          <button onClick={goBack} className="link-button">
            go back
          </button>{" "}
          to the previous page, or{" "}
          <button onClick={goToHomepage} className="link-button">
            return to the homepage
          </button>{" "}
          to get back on track.
        </p>
        <p className="output">Take a deep breath and try again!</p>
      </div>
    </div>
  );
};

export default NotFound;
