/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Compass, BookOpen, Sparkles, ChevronRight, HelpCircle, ArrowRight } from "lucide-react";

interface SyllogismStep {
  id: number;
  name: string;
  sanskrit: string;
  translation: string;
  statement: string;
  definition: string;
  role: string;
  cognitiveAction: string;
}

const PRESET_SYLLOGISMS = [
  {
    title: "Anumāna of the Smoky Mountain (पर्वतो वह्निमान्)",
    description: "The classic Nyāya example proving the presence of fire on a mountain via observed smoke.",
    steps: [
      {
        id: 1,
        name: "Pratijñā",
        sanskrit: "प्रतिज्ञा (Proposition)",
        translation: "The assertion of the thesis to be proved.",
        statement: "The mountain is on fire.",
        definition: "Sanskrit: प्रतिज्ञानम्। State the thesis to define the locus (Pakṣa) and the predicate (Sādhya).",
        role: "Defines the subject under inquiry ('the mountain') and the property we wish to prove ('has fire').",
        cognitiveAction: "Sets the intellectual direction of the dispute (Sādhana-bhumikā)."
      },
      {
        id: 2,
        name: "Hetu",
        sanskrit: "हेतु (Reason)",
        translation: "The reason or evidence supporting the proposition.",
        statement: "Because it has smoke.",
        definition: "Sanskrit: साधनम्। State the probans or sign (Liṅga) that is observed in the locus.",
        role: "Establishes the empirical ground of the claim. Smoke is the middle term (Hetu) linking subject to predicate.",
        cognitiveAction: "Bridges the visible effect to its unperceived logical cause."
      },
      {
        id: 3,
        name: "Udāharaṇa",
        sanskrit: "उदाहरण (Universal Example)",
        translation: "The universal relation backed by an indisputable example.",
        statement: "Wherever there is smoke, there is fire, as in a kitchen hearth.",
        definition: "Sanskrit: निदर्शनम्। Cite a universal concomitance (Vyāpti) observed in familiar experience.",
        role: "Validates the reasoning by anchoring it in universal physical laws and common human consensus (Sādharmya/Vaidharmya).",
        cognitiveAction: "Formulates inductive certitude based on prior uncontradicted observation."
      },
      {
        id: 4,
        name: "Upanaya",
        sanskrit: "उपनय (Application)",
        translation: "Applying the universal rule to the specific case.",
        statement: "The mountain has smoke, which is invariably accompanied by fire.",
        definition: "Sanskrit: उपनयनम्। Re-assert the presence of the reason (Hetu) in this specific locus.",
        role: "Performs the vital cognitive synthesis (Parāmārśa) combining the general law with the immediate sensory datum.",
        cognitiveAction: "Acts as the deductive bridge, certifying that this instance conforms to the cosmic rule."
      },
      {
        id: 5,
        name: "Nigamana",
        sanskrit: "निगमन (Conclusion)",
        translation: "Restatement of the proposition as a verified conclusion.",
        statement: "Therefore, the mountain is on fire.",
        definition: "Sanskrit: उपसंहारः। The final culmination proving the thesis.",
        role: "Restates the original Pratijñā with absolute, validated logical certainty. The doubt is completely resolved.",
        cognitiveAction: "Establishes Siddhānta (settled philosophical truth) in the assembly."
      }
    ]
  },
  {
    title: "Anitya-Śabda: Impermanence of Sound (शब्दोऽनित्यः)",
    description: "A classical dispute between schools of logic regarding the temporal, produced nature of sound.",
    steps: [
      {
        id: 1,
        name: "Pratijñā",
        sanskrit: "प्रतिज्ञा (Proposition)",
        translation: "The assertion of the thesis to be proved.",
        statement: "Sound is non-eternal (anitya).",
        definition: "Declares that sound, contrary to some traditional assertions, does not exist eternally in space.",
        role: "Identifies the subject under examination ('sound') and its temporary nature ('non-eternal').",
        cognitiveAction: "Initiates the dialectical inquiry into the nature of audibility."
      },
      {
        id: 2,
        name: "Hetu",
        sanskrit: "हेतु (Reason)",
        translation: "The reason or evidence supporting the proposition.",
        statement: "Because it is created or produced (kṛtakatva).",
        definition: "Relies on the fact that sound requires an active agent, instrument, or strike to emerge.",
        role: "Introduces the causal property ('being produced') which serves as the infallible sign of impermanence.",
        cognitiveAction: "Directs attention to the causal lineage of the auditory phenomenon."
      },
      {
        id: 3,
        name: "Udāharaṇa",
        sanskrit: "उदाहरण (Universal Example)",
        translation: "The universal relation backed by an indisputable example.",
        statement: "Whatever is produced is non-eternal, like a clay pot made by a potter.",
        definition: "Asserts the invariable relation: 'Creation implies eventual destruction' (Vyāpti).",
        role: "Uses a familiar, material object (the clay pot) as an undisputed reference point of perishability.",
        cognitiveAction: "Reinforces causal laws through immediate material reality."
      },
      {
        id: 4,
        name: "Upanaya",
        sanskrit: "उपनय (Application)",
        translation: "Applying the universal rule to the specific case.",
        statement: "Sound is likewise produced (and thus possesses this property).",
        definition: "Confirms that sound fits the exact criteria of a created object.",
        role: "Fuses the general law of perishability with the specific auditory case under investigation.",
        cognitiveAction: "Applies the macro-principle of creation to the micro-reality of sound waves."
      },
      {
        id: 5,
        name: "Nigamana",
        sanskrit: "निगमन (Conclusion)",
        translation: "Restatement of the proposition as a verified conclusion.",
        statement: "Therefore, sound is non-eternal.",
        definition: "The unassailable proof of the temporal nature of sound.",
        role: "Closes the argument, converting a provisional thesis into established knowledge.",
        cognitiveAction: "Dissolves dogmatic claims of phonetic eternity."
      }
    ]
  },
  {
    title: "Deha-Vināśa: Materiality of the Body (शरीरं विनाशि)",
    description: "An inquiry into the compound and perishable nature of the physical body.",
    steps: [
      {
        id: 1,
        name: "Pratijñā",
        sanskrit: "प्रतिज्ञा (Proposition)",
        translation: "The assertion of the thesis to be proved.",
        statement: "The physical body is subject to decay and dissolution.",
        definition: "Declares the physical frame to be inherently unstable and transient.",
        role: "Targets the biological subject ('the physical body') to prove its ultimate perishing.",
        cognitiveAction: "Sets up the philosophical reflection on physical impermanence."
      },
      {
        id: 2,
        name: "Hetu",
        sanskrit: "हेतु (Reason)",
        translation: "The reason or evidence supporting the proposition.",
        statement: "Because it consists of composite, physical parts (sāvayavatva).",
        definition: "The body is a collection of organs, elements, tissues, and skeletal components.",
        role: "Identifies composition or assemblage ('having parts') as the defining sign.",
        cognitiveAction: "Underlines the composite nature of physical frameworks."
      },
      {
        id: 3,
        name: "Udāharaṇa",
        sanskrit: "उदाहरण (Universal Example)",
        translation: "The universal relation backed by an indisputable example.",
        statement: "Whatever consists of composite parts eventually disintegrates, like a wooden chariot.",
        definition: "Establish the law: 'What has been put together must eventually fall apart'.",
        role: "Cites a chariot, which is clearly assembled by parts and breaks down when worn out.",
        cognitiveAction: "Illustrates composition-collapse dynamics using a macroscopic tool."
      },
      {
        id: 4,
        name: "Upanaya",
        sanskrit: "उपनय (Application)",
        translation: "Applying the universal rule to the specific case.",
        statement: "The body is a composite assemblage of parts in the exact same manner.",
        definition: "Confirms that biological systems share the exact properties of mechanical compounds.",
        role: "Fuses mechanical disassembly laws directly onto human physiology.",
        cognitiveAction: "Synthesizes physical laws with organic existence."
      },
      {
        id: 5,
        name: "Nigamana",
        sanskrit: "निगमन (Conclusion)",
        translation: "Restatement of the proposition as a verified conclusion.",
        statement: "Therefore, the physical body is subject to decay and dissolution.",
        definition: "The final deduction establishing the decay of the composite frame.",
        role: "Firmly resolves any cognitive illusions regarding bodily physical immortality.",
        cognitiveAction: "Concludes the lesson with empirical and philosophical clarity."
      }
    ]
  }
];

const COGNITIVE_LINKS = [
  {
    source: 1,
    target: 2,
    transition: "Akāṅkṣā (आकाङ्क्षा)",
    description: "The psychological desire to know the underlying ground or reason for the assertion."
  },
  {
    source: 2,
    target: 3,
    transition: "Vyāpti-smṛti (व्याप्तिस्मरणम्)",
    description: "Recalling the invariable, universal relationship linking the reason with the predicate, backed by a known example."
  },
  {
    source: 3,
    target: 4,
    transition: "Upanayana-saṃyoga (उपनयनसंयोगः)",
    description: "Synthesizing and applying that universal connection directly onto the subject under investigation."
  },
  {
    source: 4,
    target: 5,
    transition: "Nigamana-siddhi (निगमनसिद्धिः)",
    description: "The final synthesis (Parāmārśa) where the predicate is fully established in the subject as an absolute truth."
  }
];

export default function NyayaSyllogismD3() {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [activeStepId, setActiveStepId] = useState<number>(1);
  const [activeLinkId, setActiveLinkId] = useState<number | null>(null);

  // Custom step state for custom argument builder
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customSteps, setCustomSteps] = useState<SyllogismStep[]>(
    PRESET_SYLLOGISMS[0].steps.map(s => ({ ...s }))
  );

  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeSyllogism = isCustomMode 
    ? { title: "Custom Logic Construction", description: "Your custom formulated Nyāya-Syllogism.", steps: customSteps }
    : PRESET_SYLLOGISMS[selectedPresetIndex];

  const currentStep = activeSyllogism.steps.find((s) => s.id === activeStepId) || activeSyllogism.steps[0];

  // Draw the D3 diagram
  useEffect(() => {
    if (!svgRef.current) return;

    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll("*").remove(); // Clear previous drawings

    const width = 500;
    const height = 550;
    const padding = { top: 40, right: 20, bottom: 40, left: 140 };

    // Set up responsive container attributes
    svgElement
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%");

    // Calculate vertical coordinates for the 5 nodes
    const nodeYPositions = d3.scaleLinear()
      .domain([1, 5])
      .range([padding.top + 30, height - padding.bottom - 30]);

    const nodeX = width / 2;

    // Define colors according to classic manuscript style
    const colors = {
      defaultNodeBg: "#FFFDF9",
      activeNodeBg: "#795548",
      hoverNodeBg: "#FAF2D6",
      borderColor: "#1A1A1A",
      textDark: "#1A1A1A",
      textLight: "#FFFFFF",
      linkDefault: "rgba(121, 85, 72, 0.45)",
      linkActive: "#C25E3E",
      arrowColor: "#795548"
    };

    // Draw lines/connectors (links)
    COGNITIVE_LINKS.forEach((link, idx) => {
      const y1 = nodeYPositions(link.source) as number;
      const y2 = nodeYPositions(link.target) as number;
      const isLinkActive = activeLinkId === idx;

      // Draw path with a slight curve or straight line with offset
      const linePath = d3.path();
      linePath.moveTo(nodeX, y1 + 25); // from bottom of source rect
      linePath.lineTo(nodeX, y2 - 25); // to top of target rect

      // Draw transition connection
      svgElement.append("path")
        .attr("d", linePath.toString())
        .attr("fill", "none")
        .attr("stroke", isLinkActive ? colors.linkActive : colors.linkDefault)
        .attr("stroke-width", isLinkActive ? 4 : 2)
        .attr("marker-end", "url(#arrow)")
        .style("transition", "all 0.25s ease")
        .style("cursor", "pointer")
        .on("mouseenter", () => {
          setActiveLinkId(idx);
        })
        .on("mouseleave", () => {
          setActiveLinkId(null);
        });

      // Draw transition label on the link
      const midY = (y1 + y2) / 2;
      
      // Background bubble for transition label
      const labelText = link.transition.split(" ")[0]; // just first word for brevity
      const textWidth = labelText.length * 7 + 14;

      svgElement.append("rect")
        .attr("x", nodeX - textWidth / 2)
        .attr("y", midY - 10)
        .attr("width", textWidth)
        .attr("height", 20)
        .attr("fill", isLinkActive ? "#FCF8EC" : "#FAF6E8")
        .attr("stroke", isLinkActive ? colors.linkActive : colors.borderColor)
        .attr("stroke-width", isLinkActive ? 1.5 : 1)
        .attr("rx", 3)
        .style("cursor", "pointer")
        .on("mouseenter", () => {
          setActiveLinkId(idx);
        })
        .on("mouseleave", () => {
          setActiveLinkId(null);
        });

      svgElement.append("text")
        .attr("x", nodeX)
        .attr("y", midY + 4)
        .attr("text-anchor", "middle")
        .attr("font-family", "'JetBrains Mono', monospace")
        .attr("font-size", "9px")
        .attr("font-weight", "bold")
        .attr("fill", isLinkActive ? colors.linkActive : colors.textDark)
        .text(labelText)
        .style("cursor", "pointer")
        .on("mouseenter", () => {
          setActiveLinkId(idx);
        })
        .on("mouseleave", () => {
          setActiveLinkId(null);
        });
    });

    // Draw arrowhead marker definition
    svgElement.append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 5)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", colors.arrowColor);

    // Draw step nodes
    activeSyllogism.steps.forEach((step) => {
      const y = nodeYPositions(step.id) as number;
      const rectWidth = 320;
      const rectHeight = 50;
      const rx = rectX(nodeX, rectWidth);

      const isActive = activeStepId === step.id;

      // Group for each node
      const nodeGroup = svgElement.append("g")
        .style("cursor", "pointer")
        .on("click", () => {
          setActiveStepId(step.id);
        });

      // Decorative outer shadow card effect
      nodeGroup.append("rect")
        .attr("x", rx + 4)
        .attr("y", y - rectHeight / 2 + 4)
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .attr("fill", "rgba(26,26,26,0.1)")
        .attr("stroke", "none");

      // Core rectangular container
      const rectNode = nodeGroup.append("rect")
        .attr("x", rx)
        .attr("y", y - rectHeight / 2)
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .attr("fill", isActive ? colors.activeNodeBg : colors.defaultNodeBg)
        .attr("stroke", colors.borderColor)
        .attr("stroke-width", isActive ? 2.5 : 2)
        .style("transition", "all 0.2s ease");

      // Hover effect via D3 transitions
      nodeGroup.on("mouseover", function() {
        if (!isActive) {
          rectNode.attr("fill", colors.hoverNodeBg);
        }
      }).on("mouseout", function() {
        if (!isActive) {
          rectNode.attr("fill", colors.defaultNodeBg);
        }
      });

      // Add a small Sanskrit step number circle on the left
      const numRadius = 13;
      const numX = rx + 25;
      nodeGroup.append("circle")
        .attr("cx", numX)
        .attr("cy", y)
        .attr("r", numRadius)
        .attr("fill", isActive ? "#FFFDF9" : colors.activeNodeBg)
        .attr("stroke", colors.borderColor)
        .attr("stroke-width", 1.5);

      nodeGroup.append("text")
        .attr("x", numX)
        .attr("y", y + 4)
        .attr("text-anchor", "middle")
        .attr("font-family", "serif")
        .attr("font-weight", "black")
        .attr("font-size", "11px")
        .attr("fill", isActive ? colors.activeNodeBg : "#FFFDF9")
        .text(toDevanagariDigits(step.id));

      // Step title (Latin/Sanskrit name)
      nodeGroup.append("text")
        .attr("x", rx + 48)
        .attr("y", y - 4)
        .attr("font-family", "'Playfair Display', serif")
        .attr("font-weight", "bold")
        .attr("font-size", "13px")
        .attr("fill", isActive ? colors.textLight : colors.textDark)
        .text(step.name);

      nodeGroup.append("text")
        .attr("x", rx + 48)
        .attr("y", y + 14)
        .attr("font-family", "serif")
        .attr("font-size", "10px")
        .attr("fill", isActive ? "rgba(255,255,255,0.8)" : "#795548")
        .attr("font-weight", "600")
        .text(step.sanskrit.split(" ")[0]);

      // Step text value preview on the right (truncated if needed)
      const previewText = step.statement.length > 25 
        ? step.statement.slice(0, 22) + "..." 
        : step.statement;

      nodeGroup.append("text")
        .attr("x", rx + rectWidth - 15)
        .attr("y", y + 4)
        .attr("text-anchor", "end")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("font-style", "italic")
        .attr("fill", isActive ? "rgba(255, 255, 255, 0.95)" : "rgba(26, 26, 26, 0.7)")
        .text(previewText);
    });

    // Helper functions inside useEffect
    function rectX(cx: number, width: number) {
      return cx - width / 2;
    }

    function toDevanagariDigits(num: number) {
      const map: { [key: string]: string } = { "1": "१", "2": "२", "3": "३", "4": "४", "5": "५" };
      return map[num.toString()] || num.toString();
    }

  }, [selectedPresetIndex, activeStepId, activeLinkId, isCustomMode, customSteps, activeSyllogism]);

  // Update custom fields when changing preset, or to let users edit
  const handleModifyCustomStep = (id: number, field: keyof SyllogismStep, val: string) => {
    setCustomSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, [field]: val } : step))
    );
  };

  const handleCopyPresetToCustom = () => {
    setCustomSteps(PRESET_SYLLOGISMS[selectedPresetIndex].steps.map(s => ({ ...s })));
    setIsCustomMode(true);
  };

  return (
    <div className="bg-white border-2 border-[#1A1A1A] rounded-none p-5 md:p-6 space-y-6">
      
      {/* Intro block */}
      <div className="border-b-2 border-[#1A1A1A] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-black text-[#8C6239] uppercase tracking-widest block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#795548]" />
            Pañcāvayava-Citra (पञ्चावयव-चित्रम्)
          </span>
          <h3 className="text-lg font-serif font-black text-[#3B2314] uppercase tracking-tight">
            Interactive 5-Part Syllogism Flow Diagram
          </h3>
          <p className="text-xs text-stone-605 mt-1 font-sans">
            Explore the classic 5-step epistemic sequence of Nyāya logic using D3. Each node represents a cognitive statement, and links capture the cognitive transitions (Vṛttis).
          </p>
        </div>

        {/* Custom Mode Toggle */}
        <div className="flex bg-[#F5F2EA] p-1 border-2 border-[#1A1A1A] rounded-none font-sans text-xs font-bold">
          <button
            onClick={() => setIsCustomMode(false)}
            className={`px-3 py-1.5 cursor-pointer rounded-none transition-all ${
              !isCustomMode ? "bg-[#795548] text-white" : "text-[#1A1A1A] hover:bg-stone-200"
            }`}
          >
            Scholastic Presets
          </button>
          <button
            onClick={() => {
              setIsCustomMode(true);
              setActiveStepId(1);
            }}
            className={`px-3 py-1.5 cursor-pointer rounded-none transition-all ${
              isCustomMode ? "bg-[#795548] text-white" : "text-[#1A1A1A] hover:bg-stone-200"
            }`}
          >
            Custom Argument Builder
          </button>
        </div>
      </div>

      {/* Preset Selector Panel */}
      {!isCustomMode && (
        <div className="bg-[#F5F2EA]/40 p-4 border-2 border-[#1A1A1A] rounded-none grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_SYLLOGISMS.map((pres, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedPresetIndex(idx);
                setActiveStepId(1);
              }}
              className={`text-left p-3 border rounded-none transition-all cursor-pointer flex flex-col justify-between h-24 ${
                selectedPresetIndex === idx && !isCustomMode
                  ? "bg-white border-[#795548] ring-2 ring-[#795548]/30 shadow-sm"
                  : "bg-[#FAF8F5] border-stone-200 hover:bg-[#FAF6E8]"
              }`}
            >
              <div>
                <span className="text-[9px] font-black uppercase text-[#795548] tracking-widest">
                  Preset {idx + 1}
                </span>
                <h4 className="text-xs font-serif font-black text-[#1A1A1A] mt-0.5 line-clamp-1">
                  {pres.title}
                </h4>
              </div>
              <p className="text-[10px] text-stone-500 line-clamp-2 mt-1 leading-normal font-sans">
                {pres.description}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Interactive Arena (Split Screen) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: D3 Svg Area */}
        <div className="lg:col-span-6 xl:col-span-7 bg-[#FAF6E8]/40 border-2 border-[#1A1A1A] rounded-none p-4 flex flex-col justify-between items-center relative min-h-[500px]">
          
          {/* Header instructions overlay */}
          <div className="w-full text-center pb-2 border-b border-stone-200 text-[10px] font-mono text-stone-500 uppercase tracking-widest flex items-center justify-between">
            <span>D3 Flowchart Canvas</span>
            <span>Click nodes to select step • Hover connections for transition logic</span>
          </div>

          <div className="w-full flex-1 flex items-center justify-center py-4">
            <svg ref={svgRef} className="w-full h-full max-h-[550px]"></svg>
          </div>

          {/* Quick info footer */}
          <div className="w-full bg-white border border-[#1A1A1A]/10 p-2 text-[10px] text-stone-500 font-mono text-center">
            Active School: <strong className="text-[#795548]">{isCustomMode ? "Navya-Nyāya Playground" : "Prācīna-Nyāya System"}</strong>
          </div>
        </div>

        {/* Right: Detailed Step Inspection / Custom Editor Sidebar */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-5">
          
          {/* Transition details box when link is hovered */}
          {activeLinkId !== null && (
            <div className="bg-[#F3EBE0] border-2 border-dashed border-[#C25E3E] p-4.5 rounded-none animate-fade-in text-left">
              <span className="text-[9px] font-black text-[#C25E3E] uppercase tracking-widest block">
                Actively Hovered Cognition Flow Link
              </span>
              <h4 className="text-sm font-serif font-black text-[#1A1A1A] mt-1 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#C25E3E]" />
                {COGNITIVE_LINKS[activeLinkId].transition}
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed font-sans mt-2 italic">
                "{COGNITIVE_LINKS[activeLinkId].description}"
              </p>
            </div>
          )}

          {/* Core Inspector Panel */}
          <div className="bg-[#FAF8F5] border-2 border-[#1A1A1A] p-5 rounded-none flex-1 flex flex-col justify-between gap-5 text-left">
            <div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="text-xs bg-[#795548] text-white px-3 py-1 font-serif font-black uppercase border border-[#1A1A1A]">
                  Step {currentStep.id} of ५
                </span>
                <span className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider">
                  Avayava Detailer
                </span>
              </div>

              {/* Sanskrit Term & Definition */}
              <div className="mt-4 space-y-1.5">
                <span className="text-[9px] font-black uppercase text-[#795548] tracking-widest block">
                  Sanskrit Avayava Name (अवयवसंज्ञा)
                </span>
                <h3 className="text-xl font-serif font-black text-[#3B2314]">
                  {currentStep.sanskrit}
                </h3>
                <p className="text-[11px] italic text-stone-500 font-sans">
                  {currentStep.translation}
                </p>
              </div>

              {/* The Live Claim */}
              <div className="mt-5 space-y-2">
                <span className="text-[9px] font-black uppercase text-stone-500 tracking-widest block">
                  Current Formulated Statement (वाक्यम्)
                </span>
                
                {/* Editor or standard display depending on mode */}
                {isCustomMode ? (
                  <textarea
                    value={currentStep.statement}
                    onChange={(e) => handleModifyCustomStep(currentStep.id, "statement", e.target.value)}
                    rows={2}
                    className="w-full text-xs font-serif p-2.5 bg-white border-2 border-[#1A1A1A] rounded-none focus:outline-none focus:ring-1 focus:ring-[#795548] text-[#1A1A1A]"
                    placeholder={`Write your step statement...`}
                  />
                ) : (
                  <div className="p-4 bg-white border border-[#1A1A1A]/10 rounded-none relative manuscript-margin-line pl-8 overflow-hidden">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-red-800/30"></div>
                    <p className="text-sm font-serif font-black text-[#1A1A1A] leading-relaxed">
                      "{currentStep.statement}"
                    </p>
                  </div>
                )}
              </div>

              {/* Epistemological Definition & Role */}
              <div className="mt-6 space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-stone-500 tracking-widest block">
                    Nyāyasūtra Gloss (सूत्रानुमोदितलक्षणम्)
                  </span>
                  <p className="text-xs text-stone-750 font-sans leading-relaxed">
                    {currentStep.definition}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-stone-500 tracking-widest block">
                    Logical Epistemic Value
                  </span>
                  <p className="text-xs text-stone-750 font-sans leading-relaxed">
                    {currentStep.role}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-stone-500 tracking-widest block">
                    Sabhā Cognitive Action
                  </span>
                  <p className="text-xs text-stone-750 font-sans leading-relaxed">
                    {currentStep.cognitiveAction}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="border-t border-stone-200 pt-4 flex items-center justify-between gap-4">
              <button
                onClick={() => {
                  const nextId = (currentStep.id % 5) + 1;
                  setActiveStepId(nextId);
                }}
                className="py-1.5 px-3 bg-[#F3EBE0] hover:bg-[#795548] hover:text-white border border-[#1A1A1A] text-[10px] font-sans font-extrabold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all rounded-none"
              >
                <span>Inspect Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {!isCustomMode && (
                <button
                  onClick={handleCopyPresetToCustom}
                  className="py-1.5 px-3 bg-[#795548] hover:bg-[#1A1A1A] text-white border border-[#1A1A1A] text-[10px] font-sans font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all rounded-none shadow-none"
                >
                  <span>Edit in Custom Builder</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
