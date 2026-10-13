import React from "react";
import logo from "../assets/images/simbian-logo.png";
import { useNavigate } from "react-router-dom";

const UnderConstruction = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center px-6">

            <div className="text-center max-w-3xl">
                <div className="flex justify-center mb-10">
                    <button
                        onClick={() => navigate("/")}
                        className="cursor-pointer"
                    >
                        <img
                            src={logo}
                            alt="Simbian Systems"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            style={{ color: "transparent", fontSize: 0 }}
                            className="h-12 md:h-14 w-auto object-contain hover:scale-105 transition-transform duration-300"
                        />
                    </button>
                </div>

                {/* Gears */}
                <div className="mb-10 mt-14 flex justify-center">
                    <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="100px"
                        height="70px"
                        viewBox="0 0 100 68"
                        aria-label="Gears animation"
                        role="img"
                    >
                        <g>

                            {/* Large gear */}
                            <g>
                                <path
                                    d="M55.777,38.473l6.221-1.133c0.017-1.791-0.123-3.573-0.41-5.324l-6.321-0.19
                                    c-0.438-2.053-1.135-4.048-2.076-5.931l4.82-4.094c-0.868-1.552-1.874-3.028-3.005-4.417
                                    l-5.569,2.999c-1.385-1.54-2.98-2.921-4.771-4.099l2.124-5.954
                                    c-0.759-0.452-1.543-0.878-2.357-1.269c-0.811-0.39-1.625-0.732-2.449-1.046
                                    l-3.325,5.381c-2.038-0.665-4.113-1.052-6.183-1.174L31.34,6.002
                                    c-1.792-0.02-3.571,0.119-5.32,0.406l-0.191,6.32c-2.056,0.439-4.051,1.137-5.936,2.08
                                    l-4.097-4.82c-1.546,0.872-3.022,1.875-4.407,3.006l2.996,5.566
                                    c-1.54,1.384-2.925,2.985-4.104,4.778c-2.16-0.771-4.196-1.498-5.953-2.127
                                    c-0.449,0.765-0.875,1.544-1.265,2.354c-0.39,0.811-0.733,1.63-1.049,2.457
                                    c1.587,0.981,3.424,2.119,5.377,3.325c-0.662,2.037-1.049,4.117-1.172,6.186
                                    l-6.218,1.136c-0.021,1.789,0.12,3.566,0.407,5.321l6.32,0.188
                                    c0.442,2.06,1.143,4.057,2.082,5.937l-4.818,4.095c0.872,1.549,1.873,3.026,3.009,4.412
                                    l5.563-2.998c1.392,1.54,2.989,2.92,4.777,4.099l-2.121,5.954
                                    c0.756,0.446,1.538,0.871,2.348,1.258c0.813,0.394,1.633,0.739,2.462,1.05
                                    l3.326-5.375c2.033,0.662,4.109,1.05,6.175,1.17l1.137,6.221
                                    c1.791,0.019,3.569-0.123,5.323-0.407l0.194-6.324
                                    c2.053-0.438,4.045-1.136,5.927-2.079l4.093,4.817
                                    c1.55-0.865,3.026-1.87,4.414-2.999l-2.995-5.572
                                    c1.537-1.385,2.914-2.98,4.093-4.772l5.953,2.127
                                    c0.448-0.761,0.878-1.545,1.268-2.356c0.388-0.808,0.729-1.631,1.047-2.458
                                    l-5.378-3.324C55.268,42.615,55.655,40.542,55.777,38.473z
                                    M42.302,42.435c-3.002,6.243-10.495,8.872-16.737,5.866
                                    c-6.244-2.999-8.872-10.493-5.867-16.736c3.002-6.244,10.495-8.873,16.736-5.869
                                    C42.676,28.698,45.306,36.19,42.302,42.435z"
                                    fill="#004a7c"
                                    stroke="none"
                                />

                                <animateTransform
                                    attributeName="transform"
                                    begin="0s"
                                    dur="3s"
                                    type="rotate"
                                    from="0 31 37"
                                    to="360 31 37"
                                    repeatCount="indefinite"
                                />
                            </g>

                            {/* Small gear */}
                            <g>
                                <path
                                    d="M93.068,19.253L99,16.31c-0.371-1.651-0.934-3.257-1.679-4.776
                                    l-6.472,1.404c-0.902-1.436-2.051-2.735-3.42-3.819l2.115-6.273
                                    c-0.706-0.448-1.443-0.867-2.213-1.238c-0.774-0.371-1.559-0.685-2.351-0.958
                                    l-3.584,5.567c-1.701-0.39-3.432-0.479-5.118-0.284L73.335,0
                                    c-1.652,0.367-3.256,0.931-4.776,1.672l1.404,6.47
                                    c-1.439,0.899-2.744,2.047-3.835,3.419c-2.208-0.746-4.38-1.476-6.273-2.114
                                    c-0.451,0.71-0.874,1.448-1.244,2.229c-0.371,0.764-0.68,1.541-0.954,2.329
                                    c1.681,1.078,3.612,2.323,5.569,3.579c-0.399,1.711-0.486,3.449-0.291,5.145
                                    c-2.086,1.034-4.143,2.055-5.936,2.945c0.368,1.648,0.929,3.25,1.67,4.769
                                    c1.954-0.426,4.193-0.912,6.468-1.405c0.906,1.449,2.06,2.758,3.442,3.853
                                    l-2.117,6.27c0.708,0.449,1.439,0.865,2.218,1.236
                                    c0.767,0.371,1.551,0.685,2.338,0.96c1.081-1.68,2.319-3.612,3.583-5.574
                                    c1.714,0.401,3.457,0.484,5.156,0.288L82.695,42
                                    c1.651-0.371,3.252-0.931,4.773-1.676c-0.425-1.952-0.912-4.194-1.404-6.473
                                    c1.439-0.902,2.744-2.057,3.835-3.436l6.273,2.11
                                    c0.444-0.7,0.856-1.43,1.225-2.197c0.372-0.777,0.691-1.569,0.963-2.361
                                    l-5.568-3.586C93.181,22.677,93.269,20.939,93.068,19.253z
                                    M84.365,24.062c-1.693,3.513-5.908,4.991-9.418,3.302
                                    c-3.513-1.689-4.99-5.906-3.301-9.419c1.688-3.513,5.906-4.991,9.417-3.302
                                    C84.573,16.331,86.05,20.549,84.365,24.062z"
                                    fill="#2ba84a"
                                    stroke="none"
                                />

                                <animateTransform
                                    attributeName="transform"
                                    begin="0s"
                                    dur="2s"
                                    type="rotate"
                                    from="0 78 21"
                                    to="-360 78 21"
                                    repeatCount="indefinite"
                                />
                            </g>

                        </g>
                    </svg>
                </div>

                {/* Company Name */}
                {/*<h2 className="text-[#c8a45d] text-xl tracking-[4px] uppercase mb-4">*/}
                {/*    Seventh Heaven LLC*/}
                {/*</h2>*/}

                {/* Main Heading */}
                <h1 className="text-[#0b124e] text-3xl font-bold leading-tight mb-6">
                    Page Under
                    
                    Construction
                </h1>

                {/* Description */}
                <p className="text-gray-600 text-lg leading-8 max-w-xl mx-auto mb-12">
                    We are creating something exceptional.
                    Our new experience will be available soon.
                </p>

                {/* Contact */}
                <div className="space-y-3 text-[#0b124e] text-base">

                    <a
                        href="mailto:info@simbiansystems.com"
                        className="block hover:text-[#2ba84a] transition duration-300"
                    >
                        info@simbiansystems.com
                    </a>

                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <a
                            href="tel:+919978440060"
                            className="hover:text-[#2ba84a] transition duration-300"
                        >
                            +91 99784 40060
                        </a>

                        <span className="text-gray-400">|</span>

                        <a
                            href="tel:+919898448590"
                            className="hover:text-[#2ba84a] transition duration-300"
                        >
                            +91 98984 48590
                        </a>
                    </div>
                </div>

               

                {/* Bottom */}
                <div className="mt-16 text-sm text-gray-500">
                    @ 2026  Simbian Systems. All rights reserved
                    <br />
                    Design by{" "}
                    <a
                        href="https://www.dotsandcoms.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#c8a45d] transition duration-300"
                    >
                        Dots and Coms
                    </a>
                </div>

            </div>
        </div>
    );
};

export default UnderConstruction;