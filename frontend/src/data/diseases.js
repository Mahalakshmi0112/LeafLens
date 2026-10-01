/**
 * LeafLens Disease & Remedy Database
 * Keyed by exact raw label returned by the FastAPI backend models.
 */

export const CROPS = {
  tomato: {
    id: "tomato",
    name: "Tomato",
    modelId: "model1",
    scientificName: "Solanum lycopersicum",
    iconIndex: 1,
    color: "#D9534F",
    bgTint: "rgba(217, 83, 79, 0.08)",
    diseaseCount: 9,
    description: "One of the most popular garden vegetables, susceptible to blight, bacterial spot, and viruses.",
  },
  potato: {
    id: "potato",
    name: "Potato",
    modelId: "model2",
    scientificName: "Solanum tuberosum",
    iconIndex: 2,
    color: "#B38048",
    bgTint: "rgba(179, 128, 72, 0.08)",
    diseaseCount: 2,
    description: "Staple tuber crop vulnerable to early and late blights caused by fungal pathogens.",
  },
  grape: {
    id: "grape",
    name: "Grape",
    modelId: "model3",
    scientificName: "Vitis vinifera",
    iconIndex: 3,
    color: "#7E57C2",
    bgTint: "rgba(126, 87, 194, 0.08)",
    diseaseCount: 3,
    description: "High-value fruit crop impacted by black rot, esca, and leaf blights.",
  },
  corn: {
    id: "corn",
    name: "Corn (Maize)",
    modelId: "model4",
    scientificName: "Zea mays",
    iconIndex: 4,
    color: "#E6B800",
    bgTint: "rgba(230, 184, 0, 0.08)",
    diseaseCount: 3,
    description: "Cereal grain critical for global agriculture, affected by rusts and leaf spots.",
  },
};

export const MODEL_TO_CROP = {
  model1: "tomato",
  model2: "potato",
  model3: "grape",
  model4: "corn",
};

export const CROP_TO_MODEL = {
  tomato: "model1",
  potato: "model2",
  grape: "model3",
  corn: "model4",
};

/**
 * Format raw backend label to clean friendly name
 */
export function formatDiseaseLabel(rawLabel) {
  if (!rawLabel) return "Unknown Condition";
  
  // Clean raw label
  let cleaned = rawLabel
    .replace(/^Corn_\(maize\)___/i, "")
    .replace(/^Tomato___/i, "")
    .replace(/^Potato___/i, "")
    .replace(/^Grape___/i, "");
  
  // Replace underscores and special symbols
  cleaned = cleaned.replace(/_+/g, " ").trim();
  
  // Handle specific common names
  if (cleaned.toLowerCase() === "healthy") {
    return "Healthy Leaf";
  }
  
  // Capitalize nicely
  return cleaned
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const DISEASE_DATA = {
  // TOMATO
  "Tomato___Bacterial_spot": {
    rawLabel: "Tomato___Bacterial_spot",
    cropId: "tomato",
    cropName: "Tomato",
    friendlyName: "Bacterial Spot",
    isHealthy: false,
    severity: "High", // Low, Moderate, High, Critical
    urgencyColor: "#C8694A",
    summary: "A destructive bacterial disease caused by Xanthomonas species affecting leaves, stems, and fruit.",
    whatIsIt: "Bacterial spot thrives in warm, wet, and humid conditions. It penetrates tomato foliage through natural openings or wounds, reducing photosynthetic area and defoliating the plant.",
    symptoms: [
      "Small (less than 3mm), dark brown-to-black water-soaked circular spots on leaves.",
      "Spots may be surrounded by a prominent yellowish halo.",
      "Leaves become ragged, turn brown, and drop prematurely.",
      "Sunken, scabby, rough spots on fruit with dark borders."
    ],
    actionPlan: [
      "Immediately prune off heavily infected lower leaves using sterilized shears.",
      "Avoid all overhead irrigation; water only at the soil line to keep leaves dry.",
      "Disinfect pruning shears and garden tools in a 10% bleach solution between cuts.",
      "Remove severely infected entire plants and discard in trash (do not compost)."
    ],
    organicRemedies: [
      "Apply copper octanoate (copper soap) or fixed copper fungicides certified for organic gardening.",
      "Spray Bacillus subtilis bio-fungicide weekly during humid weather as a protective bio-barrier.",
      "Apply a diluted neem oil solution (0.5% - 1%) every 7 to 10 days to inhibit bacterial spread."
    ],
    chemicalRemedies: [
      "Apply copper hydroxide mixed with mancozeb for synergistic control (where registered).",
      "Spray streptomycin sulfate bactericide if permitted in your region and disease pressure is severe.",
      "Ensure thorough coverage on both upper and undersides of leaves early in the morning."
    ],
    preventionNextSeason: [
      "Plant certified disease-free, hot-water-treated seeds or resistant cultivars.",
      "Rotate tomato crops with non-solanaceous plants (beans, corn, brassicas) for 2–3 years.",
      "Apply clean straw or plastic mulch beneath plants to prevent soil-to-leaf splashing.",
      "Provide wide spacing (60–90cm) for optimal airflow and quick canopy drying."
    ],
    whenToCallExpert: "Call your agricultural extension office if more than 30% of your crop canopy shows rapid spotting despite copper treatments, or if young seedlings develop widespread lesions."
  },

  "Tomato___Early_blight": {
    rawLabel: "Tomato___Early_blight",
    cropId: "tomato",
    cropName: "Tomato",
    friendlyName: "Early Blight",
    isHealthy: false,
    severity: "Moderate",
    urgencyColor: "#E08738",
    summary: "Common fungal disease caused by Alternaria solani causing distinctive concentric 'bullseye' leaf lesions.",
    whatIsIt: "Early blight is a fungal infection starting on older bottom leaves and moving upward. It overwinters in plant debris and soil, spreading rapidly during warm, alternating wet and dry weather.",
    symptoms: [
      "Dark brown to black spots with concentric rings forming a distinctive 'target' or 'bullseye' pattern.",
      "Yellowing (chlorosis) of the leaf tissue surrounding the spots.",
      "Leaves turn completely yellow, wither, and drop from the bottom up.",
      "Dark, sunken, leathery lesions at the stem end of fruits."
    ],
    actionPlan: [
      "Remove and bag infected lower leaves immediately to stop spores from splashing upwards.",
      "Stake and tie tomato vines up off the bare ground.",
      "Spread a 2-3 inch layer of clean organic mulch beneath the vines.",
      "Switch to drip or soaker hose irrigation."
    ],
    organicRemedies: [
      "Apply liquid copper fungicide or Bordeaux mixture at 7-10 day intervals.",
      "Spray bio-fungicides based on Bacillus amyloliquefaciens or Trichoderma harzianum.",
      "Use potassium bicarbonate sprays (3 tbsp/gal with insecticidal soap) to alter leaf surface pH."
    ],
    chemicalRemedies: [
      "Apply protective fungicides containing chlorothalonil or mancozeb at first sign of spots.",
      "For systemic treatment, rotate with azoxystrobin, difenoconazole, or pyraclostrobin.",
      "Always follow label pre-harvest intervals (PHI) before consuming fruit."
    ],
    preventionNextSeason: [
      "Choose early blight-resistant or tolerant varieties (e.g., Mountain Supreme, Defiant).",
      "Practice strict 3-year crop rotation away from solanaceous plants.",
      "Thoroughly clean up and burn/bury all tomato stalks after harvest."
    ],
    whenToCallExpert: "Contact an agronomist if concentric lesions spread into the main stem collar (collar rot) or if fruit clusters begin rotting prematurely."
  },

  "Tomato___Late_blight": {
    rawLabel: "Tomato___Late_blight",
    cropId: "tomato",
    cropName: "Tomato",
    friendlyName: "Late Blight",
    isHealthy: false,
    severity: "Critical",
    urgencyColor: "#D9534F",
    summary: "A rapid, highly destructive water mold disease (Phytophthora infestans) that can destroy entire fields in days.",
    whatIsIt: "Late blight is infamous for causing the Irish Potato Famine. It thrives in cool (15-22°C), wet, and foggy weather. Airborne spores travel miles on the wind.",
    symptoms: [
      "Large, irregular water-soaked pale green to dark brown lesions that expand very rapidly.",
      "Delicate white fuzzy mold on leaf undersides during humid or early morning conditions.",
      "Stems turn dark brown to black and collapse.",
      "Firm, dark, greasy-looking brown rot on green or ripe tomatoes."
    ],
    actionPlan: [
      "URGENT: Act within 24 hours. Identify if adjacent plants are also showing symptoms.",
      "Prune and safely bag all infected tissue on dry sunny afternoons to minimize spore release.",
      "If more than 50% of the plant is affected, remove and destroy the entire plant immediately.",
      "Alert neighboring farmers or gardeners as spores spread rapidly through the air."
    ],
    organicRemedies: [
      "Preventive copper sprays (copper hydroxide/sulfate) are essential before infection sets in.",
      "Apply biostimulants that induce systemic acquired resistance (SAR), like phosphite salts.",
      "Note: Organic remedies rarely cure advanced active late blight infections."
    ],
    chemicalRemedies: [
      "Apply systemic fungicides: cymoxanil, dimethomorph, mandipropamid, or cyazofamid.",
      "Combine with protectant fungicides (mancozeb or chlorothalonil) for resistance management.",
      "Repeat applications every 5 to 7 days while humid/rainy weather persists."
    ],
    preventionNextSeason: [
      "Plant late blight-resistant hybrids (e.g., Legend, Defiant PHR, Mountain Magic).",
      "Do not save seeds from infected plants or leave volunteer tomatoes in the field.",
      "Destroy all cull piles and volunteer potato/tomato shoots in early spring."
    ],
    whenToCallExpert: "Contact your local agricultural extension service immediately upon confirming late blight, as it poses a regional threat to commercial crops."
  },

  "Tomato___Leaf_Mold": {
    rawLabel: "Tomato___Leaf_Mold",
    cropId: "tomato",
    cropName: "Tomato",
    friendlyName: "Leaf Mold",
    isHealthy: false,
    severity: "Moderate",
    urgencyColor: "#E08738",
    summary: "A fungal disease (Passalora fulva) primarily targeting high-humidity greenhouse and polytunnel tomatoes.",
    whatIsIt: "Leaf mold develops when relative humidity exceeds 85% with mild temperatures. It primarily attacks foliage, reducing yield and weakening the plant.",
    symptoms: [
      "Pale green or yellowish spots with indefinite margins on upper leaf surfaces.",
      "Olive-green to velvety brown mold growth on the corresponding underside of the leaf.",
      "Infected leaves curl, wither, and fall prematurely.",
      "Blossoms may drop, resulting in poor fruit set."
    ],
    actionPlan: [
      "Increase greenhouse ventilation with exhaust fans or open sidewalls.",
      "Prune dense foliage and suckers to open the canopy to fresh air.",
      "Avoid wetting the foliage during evening waterings.",
      "Remove and discard severely affected bottom leaves."
    ],
    organicRemedies: [
      "Spray sulfur or copper-based fungicides on undersides of leaves.",
      "Use bio-fungicide sprays containing Bacillus pumilus or Streptomyces lydicus.",
      "Apply potassium silicate to strengthen leaf cuticle resistance."
    ],
    chemicalRemedies: [
      "Apply fungicides containing chlorothalonil, azoxystrobin, or cyprodinil + fludioxonil.",
      "Ensure complete coverage of the lower leaf surfaces where spores produce velvet growth."
    ],
    preventionNextSeason: [
      "Maintain greenhouse relative humidity below 80% with adequate heating/ventilation.",
      "Select resistant tomato cultivars with Cf-gene resistance.",
      "Sanitize greenhouse structures, pots, and stakes between crop cycles."
    ],
    whenToCallExpert: "Consult a specialist if greenhouse leaf mold persists despite ventilation improvements and fungicide rotations."
  },

  "Tomato___Septoria_leaf_spot": {
    rawLabel: "Tomato___Septoria_leaf_spot",
    cropId: "tomato",
    cropName: "Tomato",
    friendlyName: "Septoria Leaf Spot",
    isHealthy: false,
    severity: "Moderate",
    urgencyColor: "#E08738",
    summary: "A very common fungal disease (Septoria lycopersici) causing heavy lower foliage loss.",
    whatIsIt: "Septoria overwinters in crop residues and nightshade weeds. It spreads via rain splashing, insects, and tools during warm (20-25°C) wet periods.",
    symptoms: [
      "Numerous tiny (1.5–3mm) circular spots with dark brown margins and gray or tan centers.",
      "Tiny black specks (pycnidia fruiting bodies) visible in the center of mature spots.",
      "Leaves turn yellow around spots, dry up, and drop off.",
      "Unlike early blight, fruit is rarely directly infected, but exposed to sunscald."
    ],
    actionPlan: [
      "Prune off infected leaves starting from the base of the plant.",
      "Mulch soil around plants to prevent fungal spores from splashing onto leaves.",
      "Provide strong stakes or cages to elevate foliage well above wet soil.",
      "Water exclusively at root zone with drip irrigation."
    ],
    organicRemedies: [
      "Apply liquid copper octanoate or Bordeaux mixture at 7-day intervals during wet periods.",
      "Spray bio-fungicides with Bacillus subtilis or Trichoderma.",
      "Apply neem oil as a supplemental antifungal deterrent."
    ],
    chemicalRemedies: [
      "Spray protectants containing chlorothalonil, mancozeb, or copper sulfate.",
      "Rotate with azoxystrobin or pyraclostrobin to prevent fungal resistance."
    ],
    preventionNextSeason: [
      "Eradicate nightshade weeds and horsenettle from surrounding field edges.",
      "Rotate crops on a 3-year cycle away from tomatoes, potatoes, and eggplants.",
      "Deep plow or thoroughly compost post-harvest tomato vines."
    ],
    whenToCallExpert: "Consult if defoliation exceeds 50% before fruit ripening, which increases severe sunscald risk."
  },

  "Tomato___Spider_mites Two-spotted_spider_mite": {
    rawLabel: "Tomato___Spider_mites Two-spotted_spider_mite",
    cropId: "tomato",
    cropName: "Tomato",
    friendlyName: "Two-Spotted Spider Mites",
    isHealthy: false,
    severity: "Moderate",
    urgencyColor: "#E08738",
    summary: "Microscopic arachnid pests (Tetranychus urticae) that suck sap and sap leaf vitality in hot, dry weather.",
    whatIsIt: "Spider mites multiply rapidly in hot, dry, and dusty conditions. They feed on plant sap on the underside of leaves, causing speckling and webbing.",
    symptoms: [
      "Fine yellow or white stippling (tiny dots) across upper leaf surfaces.",
      "Silken, delicate spider-like webbing beneath leaves and between stems.",
      "Leaves turn bronze, dry out, feel brittle, and drop.",
      "Under a hand lens, tiny moving yellowish-green mites with two dark spots can be seen."
    ],
    actionPlan: [
      "Spray leaf undersides with a strong stream of cold water to dislodge mites and destroy webs.",
      "Isolate or prune out the most heavily infested branch clusters.",
      "Mist surroundings to raise ambient humidity (spider mites hate moisture).",
      "Control dust around garden borders with mulch or ground cover."
    ],
    organicRemedies: [
      "Spray insecticidal soap or 100% cold-pressed neem oil, focusing heavily on leaf undersides.",
      "Apply horticultural oil (mineral or rosemary oil-based) early morning or evening.",
      "Release natural predatory mites (Phytoseiulus persimilis or Neoseiulus californicus)."
    ],
    chemicalRemedies: [
      "Apply specific miticides like abamectin, bifenazate, or spiromesifen.",
      "Avoid broad-spectrum synthetic pyrethroids which kill beneficial predatory insects."
    ],
    preventionNextSeason: [
      "Avoid over-fertilizing with high nitrogen, which creates tender lush growth that mites favor.",
      "Encourage beneficial insects (ladybugs, lacewings, minute pirate bugs) by planting flowering border strips.",
      "Inspect new transplants carefully before introducing them into greenhouses."
    ],
    whenToCallExpert: "Contact an entomologist if webbing covers growing tips and biological controls fail to reduce population within 10 days."
  },

  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
    rawLabel: "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    cropId: "tomato",
    cropName: "Tomato",
    friendlyName: "Tomato Yellow Leaf Curl Virus (TYLCV)",
    isHealthy: false,
    severity: "Critical",
    urgencyColor: "#D9534F",
    summary: "A devastating viral disease (Begomovirus) transmitted exclusively by sweetpotato whiteflies (Bemisia tabaci).",
    whatIsIt: "TYLCV causes severe stunting and catastrophic yield loss. Once a plant is infected, the virus cannot be cured; management focuses entirely on vector control and removal.",
    symptoms: [
      "Severe upward curling and cupping of leaf margins.",
      "Prominent yellowing (chlorosis) along leaf edges and between veins.",
      "Significant stunting of new growth, giving a bushy, bunched appearance.",
      "Heavy blossom drop; plants infected early produce zero marketable fruit."
    ],
    actionPlan: [
      "Immediately rogue (uproot and discard in sealed plastic bags) infected plants to protect remaining crop.",
      "Control whitefly populations on surrounding plants immediately.",
      "Install yellow sticky traps across the field to monitor and capture adult whiteflies.",
      "Keep garden free of alternative host weeds (mallow, jimsonweed, nightshade)."
    ],
    organicRemedies: [
      "Apply insecticidal soap, neem oil, or azadirachtin weekly to target whitefly nymphs and adults.",
      "Cover young crops with 50-mesh insect-exclusion row covers until flowering.",
      "Spray kaolin clay (surround WP) on leaves to deter whitefly feeding."
    ],
    chemicalRemedies: [
      "Apply systemic insecticides (imidacloprid, thiamethoxam, or acetamiprid) at transplanting.",
      "Rotate with insect growth regulators (buprofezin or pyriproxyfen) to suppress whitefly reproduction.",
      "Note: Chemicals control the insect vector, NOT the virus itself."
    ],
    preventionNextSeason: [
      "Plant TYLCV-resistant or tolerant tomato hybrids (e.g., Tycoon, Charger, Invictus).",
      "Maintain a 2–3 month crop-free period in the region to break whitefly disease cycles.",
      "Use UV-reflective silver plastic mulches to repel incoming whiteflies."
    ],
    whenToCallExpert: "Report widespread outbreaks to regional agricultural authorities, as TYLCV requires community-wide vector suppression."
  },

  "Tomato___Target_Spot": {
    rawLabel: "Tomato___Target_Spot",
    cropId: "tomato",
    cropName: "Tomato",
    friendlyName: "Target Spot",
    isHealthy: false,
    severity: "Moderate",
    urgencyColor: "#E08738",
    summary: "A fungal disease caused by Corynespora cassiicola causing target-like lesions on foliage and sunken spots on fruit.",
    whatIsIt: "Target spot spreads in warm (20-28°C), humid regions. Spores are dispersed by wind and splashing rain, causing extensive defoliation if left unchecked.",
    symptoms: [
      "Brown, circular lesions with light brown centers and distinct concentric dark rings on leaves.",
      "Lesions enlarge and coalesce, causing large patches of dead leaf tissue.",
      "Small, circular sunken brown lesions on fruit with a cracked or velvety center.",
      "Premature defoliation starting in the lower to middle canopy."
    ],
    actionPlan: [
      "Prune suckers and lower foliage to maximize air movement through the center of the canopy.",
      "Remove severely spotted leaves and destroy them away from the field.",
      "Eliminate overhead watering and maintain uniform soil moisture.",
      "Stake plants to keep vines elevated."
    ],
    organicRemedies: [
      "Apply copper fungicides (copper sulfate or hydroxide) at regular intervals.",
      "Spray bio-fungicides containing Bacillus amyloliquefaciens.",
      "Use potassium bicarbonate-based contact fungicides."
    ],
    chemicalRemedies: [
      "Apply strobilurin fungicides (azoxystrobin, pyraclostrobin) or SDHI fungicides (fluxapyroxad).",
      "Tank-mix with protectants like chlorothalonil to reduce resistance development.",
      "Apply before canopy closes for maximum spray penetration."
    ],
    preventionNextSeason: [
      "Rotate crops with non-susceptible species (avoid planting after soybeans or cotton).",
      "Incorporate or destroy crop debris immediately following final harvest.",
      "Select disease-tolerant varieties adapted to humid environments."
    ],
    whenToCallExpert: "Consult extension if fruit spots develop on more than 15% of green fruit before harvest."
  },

  "Tomato___Tomato_mosaic_virus": {
    rawLabel: "Tomato___Tomato_mosaic_virus",
    cropId: "tomato",
    cropName: "Tomato",
    friendlyName: "Tomato Mosaic Virus (ToMV)",
    isHealthy: false,
    severity: "High",
    urgencyColor: "#C8694A",
    summary: "An extremely stable and contagious plant virus (Tobamovirus) easily spread mechanically by hands and tools.",
    whatIsIt: "ToMV can survive in dry plant debris and seed coats for decades. It spreads rapidly through sap contact, pruning shears, contaminated hands, and tobacco user contact.",
    symptoms: [
      "Mottling of leaves with alternating light green and dark green mosaic patterns.",
      "Fern-like distortion or shoestringing of leaf blades.",
      "Internal browning (brown wall) of fruit flesh.",
      "Stunted growth, yellowing, and poor overall plant vigor."
    ],
    actionPlan: [
      "Remove and destroy infected plants immediately—never add to compost.",
      "Wash hands thoroughly with soap and water (or 20% non-fat dry milk solution) before handling plants.",
      "Disinfect all garden tools, stakes, and cages with a 20% bleach solution or trisodium phosphate (TSP).",
      "Prohibit smoking or tobacco handling near tomato plants."
    ],
    organicRemedies: [
      "Spray skim milk or powdered milk solution (20%) on tools and hands as an antiviral preventative.",
      "No chemical or organic cures exist for actively infected plants; prevention is the only control."
    ],
    chemicalRemedies: [
      "There are no effective chemical sprays for plant viruses.",
      "Do not spray standard insecticides expecting to cure mosaic virus."
    ],
    preventionNextSeason: [
      "Plant certified virus-free seeds and resistant varieties marked with 'Tm-2' or 'ToMV'.",
      "Soak seeds in 10% trisodium phosphate (TSP) solution for 15 minutes before planting if non-certified.",
      "Steam or solarize contaminated garden soil before replanting."
    ],
    whenToCallExpert: "Call your agricultural extension office if widespread mosaic symptoms appear in commercial greenhouse production."
  },

  "Tomato___healthy": {
    rawLabel: "Tomato___healthy",
    cropId: "tomato",
    cropName: "Tomato",
    friendlyName: "Healthy Tomato Leaf",
    isHealthy: true,
    severity: "Healthy",
    urgencyColor: "#4F6F52",
    summary: "No signs of disease detected. Your tomato foliage looks vibrant, clean, and healthy!",
    whatIsIt: "Your tomato plant shows healthy chlorophyll distribution, crisp leaf margins, and robust vigor without pathogenic spotting, viral distortion, or pest damage.",
    symptoms: [
      "Uniform deep green leaf color without chlorosis or yellow halos.",
      "Clean leaf blades without fungal rings, powdery growth, or necrotic spots.",
      "Absence of stippling, webbing, or visible insect pests.",
      "Healthy vegetative growth and normal leaf curling behavior (not viral)."
    ],
    actionPlan: [
      "Continue regular morning drip irrigation at the base of the plant.",
      "Maintain a 2-3 inch layer of clean straw or shredded wood mulch around roots.",
      "Prune bottom suckers periodically to maintain excellent air circulation.",
      "Feed balanced organic fertilizer (e.g., 5-10-10) when first fruit clusters set."
    ],
    organicRemedies: [
      "Apply compost tea or seaweed kelp extract monthly for trace micronutrients.",
      "Spray companion neem oil preventatively once every 3 weeks to discourage pests."
    ],
    chemicalRemedies: [
      "No chemical interventions needed. Maintain current sound agronomic practices."
    ],
    preventionNextSeason: [
      "Continue practicing 3-year crop rotation.",
      "Keep garden beds free from solanaceous weeds.",
      "Clean and store stakes and trellises dry over winter."
    ],
    whenToCallExpert: "No expert needed! Keep monitoring weekly for early detection of seasonal pests or blights."
  },

  // POTATO
  "Potato___early_blight": {
    rawLabel: "Potato___early_blight",
    cropId: "potato",
    cropName: "Potato",
    friendlyName: "Potato Early Blight",
    isHealthy: false,
    severity: "Moderate",
    urgencyColor: "#E08738",
    summary: "Fungal leaf disease caused by Alternaria solani causing concentric dark brown lesions on potato foliage.",
    whatIsIt: "Early blight attacks potato foliage as the crop reaches maturity and tubers begin sizing. Left unmanaged, severe defoliation reduces tuber size and yield.",
    symptoms: [
      "Brown to black angular spots on older lower leaves with concentric 'target' rings.",
      "Yellowing halo surrounding the fungal spots.",
      "Leaves turn completely brown and dry, hanging down like paper on the stems.",
      "Dark, sunken, corky lesions with raised borders on tuber skin."
    ],
    actionPlan: [
      "Maintain adequate plant nutrition—stressed, nitrogen-deficient plants are far more susceptible.",
      "Avoid sprinkler irrigation; keep foliage dry, especially late in the day.",
      "Remove and destroy heavily blighted lower foliage.",
      "Ensure proper hilling to protect growing tubers from spore washdown."
    ],
    organicRemedies: [
      "Apply copper hydroxide or copper octanoate sprays at first symptom appearance.",
      "Use bio-fungicides with Bacillus amyloliquefaciens strain D747.",
      "Apply potassium bicarbonate sprays to suppress fungal spore germination."
    ],
    chemicalRemedies: [
      "Apply protectant fungicides like chlorothalonil, mancozeb, or fluazinam.",
      "Use translaminar/systemic products: azoxystrobin, pyraclostrobin, or boscalid.",
      "Follow rotational schedules to avoid fungal resistance development."
    ],
    preventionNextSeason: [
      "Plant certified disease-free seed tubers.",
      "Rotate potato fields with non-host crops (corn, cereals, pasture) for 3-4 years.",
      "Allow vines to die completely and tuber skins to cure before harvesting."
    ],
    whenToCallExpert: "Consult when defoliation reaches 20% in mid-season before tubers reach marketable size."
  },

  "Potato___late_blight": {
    rawLabel: "Potato___late_blight",
    cropId: "potato",
    cropName: "Potato",
    friendlyName: "Potato Late Blight",
    isHealthy: false,
    severity: "Critical",
    urgencyColor: "#D9534F",
    summary: "Extremely destructive oomycete (Phytophthora infestans) that turns foliage and tubers into rotting waste.",
    whatIsIt: "Late blight is the most devastating potato disease worldwide. It thrives in cool, damp conditions and can destroy an entire field within 7 to 10 days.",
    symptoms: [
      "Water-soaked, dark green to purplish-black rapidly expanding lesions on leaves.",
      "White, delicate downy fungal growth on leaf undersides in wet morning conditions.",
      "Stems turn dark brown and rot rapidly.",
      "Tubers develop a coppery-brown, dry, granular rot beneath the skin extending into the flesh."
    ],
    actionPlan: [
      "URGENT: Spray protective or curatively approved fungicides immediately upon detection.",
      "If infection is localized, rogue and bury infected potato hills in deep pits.",
      "Do not dig tubers while vines are infected and green—cut and destroy vines 2 weeks prior to harvest.",
      "Check cull piles and volunteer potatoes in adjacent fields."
    ],
    organicRemedies: [
      "Preventive applications of Bordeaux mixture or copper sulfate before rainy spells.",
      "Bio-stimulants with potassium phosphite to boost natural plant immunity.",
      "Organic controls must be strictly applied before infection takes place."
    ],
    chemicalRemedies: [
      "Apply cymoxanil, mandipropamid, fluopicolide, or propamocarb hydrochloride.",
      "Tank mix with protectant fungicides (mancozeb or chlorothalonil).",
      "Apply on tight 5–7 day intervals under high-risk disease forecast alerts."
    ],
    preventionNextSeason: [
      "Destroy all cull piles and volunteer potatoes before spring planting.",
      "Plant resistant cultivars (e.g., Sarpo Mira, Defender, Carolus).",
      "Store harvested tubers at 10-13°C for 2 weeks with high airflow to cure skin before cold storage."
    ],
    whenToCallExpert: "Report immediately to local extension offices. Late blight is a community-level emergency requiring regional tracking."
  },

  "Potato___healthy": {
    rawLabel: "Potato___healthy",
    cropId: "potato",
    cropName: "Potato",
    friendlyName: "Healthy Potato Leaf",
    isHealthy: true,
    severity: "Healthy",
    urgencyColor: "#4F6F52",
    summary: "No disease detected. Your potato foliage is lush, green, and thriving!",
    whatIsIt: "Your potato canopy is displaying vigorous vegetative growth with uniform leaf color, strong turgidity, and zero signs of early or late blight pathogens.",
    symptoms: [
      "Deep rich green foliage with smooth, clean leaflets.",
      "No water-soaked spots, concentric target lesions, or white fungal bloom.",
      "Firm, upright stems and healthy leaf petioles.",
      "Active flowering and tuber-initiation signs."
    ],
    actionPlan: [
      "Hill soil up around the base of the plants to protect developing tubers from sunlight (greening).",
      "Provide consistent soil moisture (2.5 cm water/week) especially during flowering and tuber bulking.",
      "Avoid overhead watering late in the day to minimize leaf wetness duration.",
      "Scout the underside of leaves weekly for Colorado potato beetles or aphids."
    ],
    organicRemedies: [
      "Apply foliar seaweed kelp spray monthly to enhance drought and heat stress tolerance.",
      "Mulch beds with clean straw to moderate soil temperatures."
    ],
    chemicalRemedies: [
      "No chemical sprays necessary. Maintain routine fertility and scouting."
    ],
    preventionNextSeason: [
      "Order certified seed tubers for next planting season.",
      "Maintain a 3-4 year rotational schedule away from nightshades."
    ],
    whenToCallExpert: "No action required. Consult extension if seasonal pests like Colorado potato beetle exceed threshold."
  },

  // GRAPE
  "Grape___Black_rot": {
    rawLabel: "Grape___Black_rot",
    cropId: "grape",
    cropName: "Grape",
    friendlyName: "Grape Black Rot",
    isHealthy: false,
    severity: "High",
    urgencyColor: "#C8694A",
    summary: "A destructive fungal disease (Guignardia bidwellii) attacking all green vine tissues and shriveling grapes into hard mummies.",
    whatIsIt: "Black rot spreads from overwintered mummified berries and cane lesions during warm, humid spring weather with frequent rainfall. It causes catastrophic fruit rot.",
    symptoms: [
      "Small circular reddish-brown spots on leaves surrounded by a narrow dark brown margin.",
      "Tiny black specks (pycnidia) arranged in a neat ring inside leaf spots.",
      "Infected berries turn light brown, then soften, shrivel, and turn into hard, black, wrinkled 'mummies'.",
      "Black, elongated cankers on young shoots and petioles."
    ],
    actionPlan: [
      "Rake up and destroy all dried mummified berries from the ground and vine trellises.",
      "Prune out infected cane lesions during dormant winter pruning.",
      "Canopy manage: pull leaves around fruit clusters to improve sun exposure and quick drying.",
      "Maintain strict weed control under the trellis to lower humidity."
    ],
    organicRemedies: [
      "Apply copper fungicides or liquid lime sulfur during early bud break.",
      "Spray bio-fungicides based on Bacillus subtilis every 7-10 days from early bloom.",
      "Use potassium bicarbonate (Armicarb/MilStop) as an organic contact spore disruptor."
    ],
    chemicalRemedies: [
      "Apply myclobutanil, tebuconazole, or azoxystrobin from bud break through 4 weeks post-bloom.",
      "Use protectants like mancozeb or captan during pre-bloom stages.",
      "Critical protection window: from early bloom until berries reach 6-8mm diameter."
    ],
    preventionNextSeason: [
      "Perform thorough dormant season sanitation (remove 100% of mummies).",
      "Plant black rot-resistant grape cultivars if establishing new vineyard blocks.",
      "Design vine rows aligned with prevailing winds for rapid canopy drying."
    ],
    whenToCallExpert: "Consult a viticulture advisor if black rot appears on clusters during bloom despite standard spray programs."
  },

  "Grape___Esca_(Black_Measles)": {
    rawLabel: "Grape___Esca_(Black_Measles)",
    cropId: "grape",
    cropName: "Grape",
    friendlyName: "Esca (Black Measles)",
    isHealthy: false,
    severity: "High",
    urgencyColor: "#C8694A",
    summary: "A complex trunk and wood-decay disease caused by fungal complexes (Phaeomoniella, Phaeoacremonium, Fomitiporia).",
    whatIsIt: "Esca infects grapevine vascular systems through pruning wounds. Fungi colonize the trunk, producing toxins that translocate into leaves and fruit clusters.",
    symptoms: [
      "'Tiger stripe' pattern on leaves: vivid chlorotic and reddish-brown necrotic stripes between veins.",
      "Berry spotting (Black Measles): small dark purple or brown flecks scattered over the skin.",
      "Apoplexy: sudden wilting and collapse of entire shoots or vines in hot summer weather.",
      "Cross-section of the trunk shows dark brown wood discoloration and soft spongy white rot."
    ],
    actionPlan: [
      "Mark symptomatic vines in summer so you can manage them during winter pruning.",
      "Prune symptomatic vines LAST to avoid transferring wood pathogens to healthy vines.",
      "Treat all large pruning wounds immediately with a wound sealant or pruning protectant paste.",
      "Retrain a healthy sucker from the base of the trunk (trunk renewal) if crown is sound."
    ],
    organicRemedies: [
      "Apply Trichoderma-based bio-protectants (e.g., Trichoderma atroviride) directly on fresh pruning wounds.",
      "Apply foliar nutrient sprays (boron, zinc, magnesium) to alleviate vine stress.",
      "Note: Foliar sprays do not cure internal trunk wood rot."
    ],
    chemicalRemedies: [
      "Paint pruning cuts with fungicidal sealants containing thiophanate-methyl or pyraclostrobin.",
      "Sodium arsenite was historically used but is banned; modern control relies strictly on wound protection."
    ],
    preventionNextSeason: [
      "Adopt delayed winter pruning (prune late in the dormant season when wounds heal much faster).",
      "Use double pruning techniques in mechanical vineyards.",
      "Disinfect pruning shears regularly with 70% isopropyl alcohol."
    ],
    whenToCallExpert: "Consult a viticulturist for remedial surgery techniques (trunk renewal or esca curettage) on valuable mature vines."
  },

  "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
    rawLabel: "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    cropId: "grape",
    cropName: "Grape",
    friendlyName: "Leaf Blight (Isariopsis Leaf Spot)",
    isHealthy: false,
    severity: "Moderate",
    urgencyColor: "#E08738",
    summary: "Late-season fungal leaf spotting disease caused by Pseudocercospora cladosporioides (Isariopsis clavispora).",
    whatIsIt: "Isariopsis leaf spot appears in late summer or autumn as vines mature. It causes premature leaf browning and defoliation, reducing sugar accumulation and vine hardiness.",
    symptoms: [
      "Large, irregular, angular dark reddish-brown to black spots on mature leaves.",
      "Spots often bordered by leaf veins, giving an angular mosaic look.",
      "A grayish-brown velvety coating of fungal conidiophores on the lower leaf surface.",
      "Premature leaf drop in late summer, exposing grapes to sunburning."
    ],
    actionPlan: [
      "Collect and compost or burn fallen autumn grape leaves to eliminate overwintering spores.",
      "Prune to maintain an open canopy for sunlight and air circulation.",
      "Ensure vines are well-hydrated to prevent accelerated leaf senescence.",
      "Avoid excess nitrogen fertilizer late in the season."
    ],
    organicRemedies: [
      "Spray copper oxychloride or copper hydroxide after harvest to protect foliage until natural dormancy.",
      "Apply wettable sulfur at 10-14 day intervals.",
      "Use compost tea to boost leaf surface microbiology."
    ],
    chemicalRemedies: [
      "Apply protective fungicides like mancozeb, captan, or folpet.",
      "Use systemic triazole or strobilurin fungicides (e.g., difenoconazole, kresoxim-methyl)."
    ],
    preventionNextSeason: [
      "Incorporate dormant lime-sulfur sprays in late winter to clean dormant canes.",
      "Balance trellis canopy load to avoid overcrowded shoots."
    ],
    whenToCallExpert: "Contact a viticulturist if defoliation occurs before grapes reach required Brix sugar levels for harvest."
  },

  "Grape___healthy": {
    rawLabel: "Grape___healthy",
    cropId: "grape",
    cropName: "Grape",
    friendlyName: "Healthy Grape Leaf",
    isHealthy: true,
    severity: "Healthy",
    urgencyColor: "#4F6F52",
    summary: "No disease detected. Your grapevine leaves are vibrant, clean, and in excellent condition!",
    whatIsIt: "Your grape foliage exhibits healthy chlorophyll levels, crisp lobed margins, strong vein architecture, and zero signs of fungal blights or wood toxins.",
    symptoms: [
      "Vibrant uniform green color without tiger-striping or necrotic lesions.",
      "Clean leaf blades without fungal velvety blooms or black pycnidia rings.",
      "Strong petiole attachments and vigorous shoot extension.",
      "Healthy cluster development."
    ],
    actionPlan: [
      "Continue shoot positioning, tucking, and selective leaf pulling around clusters.",
      "Maintain regulated deficit irrigation (RDI) strategies appropriate for your wine or table grape variety.",
      "Scout canopy weekly for powdery mildew, downy mildew, or berry moths.",
      "Ensure trellis wires provide even support for vigorous shoots."
    ],
    organicRemedies: [
      "Apply routine wettable sulfur preventatively during powdery mildew index spikes.",
      "Foliar seaweed sprays to strengthen vine cuticle thickness."
    ],
    chemicalRemedies: [
      "No chemical treatment required. Continue planned seasonal vineyard management."
    ],
    preventionNextSeason: [
      "Plan sanitary dormant pruning and wound protection.",
      "Keep vineyard floor vegetation mowed and managed."
    ],
    whenToCallExpert: "No intervention needed! Keep tracking cluster veraison and sugar levels."
  },

  // CORN
  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
    rawLabel: "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    cropId: "corn",
    cropName: "Corn (Maize)",
    friendlyName: "Gray Leaf Spot (Cercospora)",
    isHealthy: false,
    severity: "High",
    urgencyColor: "#C8694A",
    summary: "One of the most significant yield-limiting fungal foliar diseases of corn (Cercospora zeae-maydis).",
    whatIsIt: "Gray leaf spot overwinters in corn residue. Spores infect leaves during extended periods of warm (25-32°C), overcast weather with high humidity or morning dew.",
    symptoms: [
      "Distinct rectangular, blocky lesions restricted by parallel leaf veins.",
      "Lesions start as tan spots and mature into grayish-brown rectangular ribbons (1-7 cm long).",
      "Severe blighting and premature drying of upper canopy leaves above the ear.",
      "Weakened stalks and increased lodging (falling over) due to reduced sugar synthesis."
    ],
    actionPlan: [
      "Scout the ear leaf and leaves above the ear during silking and pollination.",
      "If more than 50% of plants show lesions on or below the ear leaf before tassel, evaluate fungicide application.",
      "Prepare for early harvesting if stalk integrity is compromised by early defoliation.",
      "Manage crop residue post-harvest with tillage or chopping."
    ],
    organicRemedies: [
      "Apply bio-fungicides with Bacillus subtilis or Bacillus amyloliquefaciens at early vegetative stages.",
      "Foliar potassium and copper applications can slow fungal spread.",
      "Organic management relies primarily on resistant hybrid selection and crop rotation."
    ],
    chemicalRemedies: [
      "Apply fungicides containing strobilurins (azoxystrobin, pyraclostrobin) + triazoles (propiconazole, tetraconazole).",
      "Optimum application timing: VT to R1 (tasseling to silking) when high risk is forecast.",
      "Ensure spray volume is sufficient to reach middle and upper canopy."
    ],
    preventionNextSeason: [
      "Select corn hybrids with high Gray Leaf Spot (GLS) resistance ratings.",
      "Rotate corn with non-grass crops like soybeans, sunflowers, or alfalfa for at least one year.",
      "In corporate conservation tillage with residue-sizing attachments."
    ],
    whenToCallExpert: "Consult an agronomist if lesions reach the ear leaf prior to tasseling across more than 25% of the field."
  },

  "Corn_(maize)___Common_rust_": {
    rawLabel: "Corn_(maize)___Common_rust_",
    cropId: "corn",
    cropName: "Corn (Maize)",
    friendlyName: "Common Corn Rust",
    isHealthy: false,
    severity: "Moderate",
    urgencyColor: "#E08738",
    summary: "A fungal disease caused by Puccinia sorghi producing brick-red to cinnamon-brown pustules on both leaf surfaces.",
    whatIsIt: "Common rust spores are carried northward on prevailing winds from warmer southern regions. It favors cool to moderate temperatures (16-25°C) and high relative humidity.",
    symptoms: [
      "Small, powdery, oval to elongate brick-red or cinnamon-brown pustules on leaves.",
      "Pustules appear on BOTH upper and lower leaf surfaces (unlike southern corn rust).",
      "When rubbed, powdery rust spores smudge onto fingers.",
      "Pustules turn dark brownish-black late in the season as resting teliospores form."
    ],
    actionPlan: [
      "Scout leaves weekly from knee-high stage through tasseling.",
      "Determine disease progression: sweet corn is much more vulnerable than field corn hybrids.",
      "Ensure corn has balanced fertility without excessive nitrogen, which can worsen rust.",
      "Irrigate early in the morning so sun quickly dries leaves."
    ],
    organicRemedies: [
      "Apply wettable sulfur sprays or sulfur dusts preventatively (effective for smallholder/sweet corn).",
      "Spray bio-fungicides (Bacillus-based) at first detection of pustules.",
      "Use neem extract as a contact antifungal deterrent."
    ],
    chemicalRemedies: [
      "Apply triazole fungicides (propiconazole, tebuconazole) or strobilurins (azoxystrobin).",
      "Treat when pustules appear on more than 6 leaves per plant prior to tasseling in sweet corn.",
      "Field corn hybrids with single-gene resistance (Rp genes) rarely require fungicide."
    ],
    preventionNextSeason: [
      "Plant corn hybrids with known resistance to Puccinia sorghi.",
      "Plant early in the season to mature the crop before high spore loads arrive on seasonal winds.",
      "Maintain balanced soil phosphorus and potassium."
    ],
    whenToCallExpert: "Consult extension if pustules appear rapidly on young corn under 6 leaves tall or in high-value sweet corn."
  },

  "Corn_(maize)___Northern_Leaf_Blight": {
    rawLabel: "Corn_(maize)___Northern_Leaf_Blight",
    cropId: "corn",
    cropName: "Corn (Maize)",
    friendlyName: "Northern Corn Leaf Blight (NCLB)",
    isHealthy: false,
    severity: "High",
    urgencyColor: "#C8694A",
    summary: "A major foliar fungal disease (Exserohilum turcicum) producing large cigar-shaped grayish-green lesions.",
    whatIsIt: "NCLB thrives in moderate temperatures (18-27°C) with long dew periods. It overwinters in corn residue, reducing photosynthesis during crucial grain-fill stages.",
    symptoms: [
      "Large (2.5 to 15 cm long), long, cigar-shaped or elliptical grayish-green to tan lesions.",
      "Dark, olive-gray velvety fungal spores develop inside lesions during damp weather.",
      "Lesions coalesce to scorch large portions of the leaf blade.",
      "Heavy grain weight loss and stalk rot if upper canopy is destroyed during pollination."
    ],
    actionPlan: [
      "Assess lesion progression: count lesions on the ear leaf and two leaves below it at tasseling.",
      "Avoid overhead irrigation during evening hours.",
      "Plan harvest timing to avoid stalk lodging if leaf area is severely compromised.",
      "Chop and bury corn stalks post-harvest."
    ],
    organicRemedies: [
      "Apply copper octanoate or copper sulfate at vegetative V6–V8 stage.",
      "Spray bio-control agents (Trichoderma or Bacillus subtilis) to suppress sporulation.",
      "Ensure strong soil biological activity with cover cropping."
    ],
    chemicalRemedies: [
      "Apply dual-mode-of-action fungicides (strobilurin + triazole, e.g., Headline AMP, Trivapro, Quilt Xcel).",
      "Optimal timing: V10 to R1 (pre-tassel to silking) when weather favors disease.",
      "Fungicide treatment is highly economic on susceptible hybrids under high disease pressure."
    ],
    preventionNextSeason: [
      "Select corn hybrids containing Ht-resistance genes (Ht1, Ht2, Ht3, or HtN).",
      "Implement a 1 to 2 year crop rotation with non-host crops (soybean, peanut, cotton).",
      "Use tillage to incorporate infected residue and accelerate decomposition."
    ],
    whenToCallExpert: "Contact an agronomist if cigar-shaped lesions appear on or above the ear leaf before tassel emergence."
  },

  "Corn_(maize)___healthy": {
    rawLabel: "Corn_(maize)___healthy",
    cropId: "corn",
    cropName: "Corn (Maize)",
    friendlyName: "Healthy Corn Leaf",
    isHealthy: true,
    severity: "Healthy",
    urgencyColor: "#4F6F52",
    summary: "No foliar disease detected. Your corn crop exhibits clean, vigorous, healthy leaves!",
    whatIsIt: "Your corn leaves show uniform chlorophyll pigmentation, smooth parallel venation, crisp edges, and no signs of rust pustules, rectangular lesions, or blights.",
    symptoms: [
      "Lush, dark green color indicating adequate nitrogen and photosynthesis.",
      "Clean leaf blades without cigar-shaped spots, pustules, or chlorotic streaks.",
      "Sturdy, upright stalk architecture and healthy leaf collars.",
      "Vigorous tassel and silk development."
    ],
    actionPlan: [
      "Ensure sufficient moisture during the critical silking and kernel-fill windows (R1-R3).",
      "Maintain sidedress nitrogen fertility according to soil test recommendations.",
      "Scout for armyworms, corn earworms, or corn borers during whorl and ear stages.",
      "Maintain weed control in row middles to conserve moisture."
    ],
    organicRemedies: [
      "Apply compost extract or fish hydrolysate during early vegetative whorl stages.",
      "Encourage beneficial predators like ground beetles and parasitoid wasps."
    ],
    chemicalRemedies: [
      "No chemical applications needed. Continue standard agronomic management."
    ],
    preventionNextSeason: [
      "Plan crop rotation with nitrogen-fixing legumes.",
      "Maintain balanced soil pH (6.0–6.8) and organic matter."
    ],
    whenToCallExpert: "No action required. Consult extension if nutrient deficiency banding appears on lower leaves."
  },
};

/**
 * Get disease details by raw label, with a fallback for unforeseen classes
 */
export function getDiseaseDetails(rawLabel) {
  if (DISEASE_DATA[rawLabel]) {
    return DISEASE_DATA[rawLabel];
  }

  // Fallback if class name varies slightly
  const isHealthy = /healthy/i.test(rawLabel);
  const friendlyName = formatDiseaseLabel(rawLabel);
  
  return {
    rawLabel: rawLabel,
    cropId: "tomato",
    cropName: "Crop",
    friendlyName: friendlyName,
    isHealthy: isHealthy,
    severity: isHealthy ? "Healthy" : "Moderate",
    urgencyColor: isHealthy ? "#4F6F52" : "#E08738",
    summary: isHealthy 
      ? "Your plant leaf appears healthy with no visible signs of pathogen damage."
      : `AI diagnosed this leaf as ${friendlyName}. Follow standard protective care.`,
    whatIsIt: `This leaf condition has been classified as ${friendlyName}. Ensure careful monitoring and sanitary crop management.`,
    symptoms: [
      "Inspect leaf surfaces for discoloration, spotting, or textural changes.",
      "Check leaf undersides for fungal blooms or insect pests."
    ],
    actionPlan: [
      "Isolate or prune visibly affected leaf sections.",
      "Avoid overhead watering and keep foliage dry.",
      "Clean tools between plants."
    ],
    organicRemedies: [
      "Apply protective copper or sulfur-based organic sprays.",
      "Use neem oil or bio-fungicides to inhibit spread."
    ],
    chemicalRemedies: [
      "Consult local agricultural extension for registered fungicides/bactericides."
    ],
    preventionNextSeason: [
      "Rotate crops and plant certified disease-resistant seeds."
    ],
    whenToCallExpert: "Consult your local agricultural extension service for lab confirmation."
  };
}
