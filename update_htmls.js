const fs = require('fs');
const path = require('path');

function updateFile(filepath, injectionHtml) {
    let content = fs.readFileSync(filepath, 'utf8');

    const startTag = '<div class="section">';
    const endTag = '</body>';

    const startIdx = content.indexOf(startTag);
    const endIdx = content.lastIndexOf(endTag);

    if (startIdx !== -1 && endIdx !== -1) {
        const newContent = content.substring(0, startIdx) + injectionHtml + '\n' + content.substring(endIdx);
        fs.writeFileSync(filepath, newContent, 'utf8');
        console.log(`Updated ${filepath}`);
    } else {
        console.log(`Failed to find tags in ${filepath}`);
    }
}

const scriptHtml = `
<div id="modal" class="modal">
    <div class="modal-content">
        <span class="close-x" onclick="closeModal()">&times;</span>
        
        <div class="modal-left">
            <img id="modal-img" src="">
        </div>

        <div class="modal-right">
            <div class="selection-area">
                <h2 id="modal-title">Product Name</h2>
                
                <div id="modal-right-options">
                    <label id="modal-option-label">Select Size</label>
                    <select id="size" onchange="updatePrice()">
                    </select>
                </div>

                <label>Quantity</label>
                <input type="number" id="qty" value="1" min="1" oninput="updatePrice()">

                <p id="price">R ####</p>

                <button class="btn-add" onclick="addToCart()">Add to Cart</button>
            </div>

            <div class="cart-summary">
                <h4>Recent Additions</h4>
                <div id="cart-list"></div>
            </div>
        </div>
    </div>
</div>

<script>
    let currentProduct = "";

    function openModal(name, imgPath, optionsList = [], defaultText = "Select Size"){
        currentProduct = name;
        document.getElementById("modal-title").textContent = name;
        document.getElementById("modal-img").src = imgPath;
        
        const sizeSelect = document.getElementById("size");
        sizeSelect.innerHTML = "";
        
        const optionsDiv = document.getElementById("modal-right-options");
        if (optionsList && optionsList.length > 0) {
            document.getElementById("modal-option-label").textContent = defaultText;
            optionsDiv.style.display = "block";
            optionsList.forEach(opt => {
                let option = document.createElement("option");
                option.value = opt;
                option.textContent = opt;
                sizeSelect.appendChild(option);
            });
        } else {
            optionsDiv.style.display = "none";
            let option = document.createElement("option");
            option.value = "N/A";
            sizeSelect.appendChild(option);
        }

        document.getElementById("modal").style.display = "block";
        updatePrice();
        renderCart();
    }

    function closeModal() { document.getElementById("modal").style.display = "none"; }

    function updatePrice(){
        document.getElementById("price").textContent = "R ####";
    }

    function renderCart() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const container = document.getElementById("cart-list");
        container.innerHTML = cart.length ? "" : "<p style='color:#999; font-size:0.8em;'>Cart empty.</p>";
        
        cart.slice(-3).reverse().forEach(item => {
            container.innerHTML += [
                '<div class="cart-item">',
                '<span>' + item.product + ' (' + item.size + ') x' + item.qty + '</span>',
                '<strong>R ####</strong>',
                '</div>'
            ].join("");
        });
    }

    function addToCart(){
        const size = document.getElementById("size").value;
        const qty = parseInt(document.getElementById("qty").value);

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push({ product: currentProduct, size: size, qty: qty });
        localStorage.setItem("cart", JSON.stringify(cart));
        
        renderCart();

        if(!confirm("Added! Continue shopping?")) {
            closeModal();
        }
    }

    window.onclick = e => { if(e.target == document.getElementById("modal")) closeModal(); }
</script>
`;

const beadsHtml = `<div class="section">
    <h3>Beads & Kits</h3>
    <div class="grid">
        <div class="card" onclick='openModal("Bead Kits", "images/placeholder.jpg", ["Pearl Beads + Pins", "Fancy Beads + Pins - Option 1", "Fancy Beads + Pins - Option 2", "Fancy Beads + Pins - Option 3", "Mix Bead Kits", "Glass Bead Box", "Ribbon Bows", "Wood Craft Small", "Wood Craft Large", "Shirt Button Box"], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Bead Kits">
            <strong>Bead Kits</strong>
        </div>
        <div class="card" onclick='openModal("Bead Setting Machines", "images/placeholder.jpg", ["Bead Setting Machine"], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Bead Setting Machines">
            <strong>Bead Setting Machines</strong>
        </div>
        <div class="card" onclick='openModal("Beads", "images/beads&kits/beadsCat.jpg", ["Beads - 4mm", "Beads - 6mm", "Beads - 8mm", "Beads - 10mm", "Beads - 12mm", "Glass Beads"], "Select Product")'>
            <img src="images/beads&kits/beadsCat.jpg" alt="Beads">
            <strong>Beads</strong>
        </div>
    </div>
</div>
` + scriptHtml;

const boningHtml = `<div class="section">
    <h3>Boning, Bra Cups & Shoulder Pads</h3>
    <div class="grid">
        <div class="card" onclick='openModal("Boning", "images/placeholder.jpg", ["Polyester Boning - 6mm", "Polyester Boning - 8mm", "Polyester Boning - 10mm", "Polyester Boning - 12mm", "Polyester Boning - 15mm", "Clear Boning - 6mm", "Clear Boning - 8mm", "Clear Boning - 12mm"], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Boning">
            <strong>Boning</strong>
        </div>
        <div class="card" onclick='openModal("Shoulder Pads & Rolls", "images/placeholder.jpg", ["Shoulder Rolls", "Mens Shoulder Pads - 20mm - White", "Mens Shoulder Pads - 20mm - Black", "Soft Shoulder Pads - Small - White", "Soft Shoulder Pads - Small - Black", "Soft Shoulder Pads - Medium - White", "Soft Shoulder Pads - Medium - Black", "Soft Shoulder Pads - Large - White", "Soft Shoulder Pads - Large - Black"], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Shoulder Pads & Rolls">
            <strong>Shoulder Pads & Rolls</strong>
        </div>
        <div class="card" onclick='openModal("Bra Cups", "images/placeholder.jpg", ["Type A Bra Cups - Small - Black", "Type A Bra Cups - Small - White", "Type A Bra Cups - Small - Skin Tone", "Type A Bra Cups - Medium - Black", "Type A Bra Cups - Medium - White", "Type A Bra Cups - Medium - Skin Tone", "Type A Bra Cups - Large - Black", "Type A Bra Cups - Large - White", "Type A Bra Cups - Large - Skin Tone", "Type A Bra Cups - XL - Black", "Type A Bra Cups - XL - White", "Type A Bra Cups - XL - Skin Tone", "Type A Bra Cups - XXL - Black", "Type A Bra Cups - XXL - White", "Type A Bra Cups - XXL - Skin Tone", "Type A Bra Cups - XXXL - Black", "Type A Bra Cups - XXXL - White", "Type A Bra Cups - XXXL - Skin Tone", "Type B Bra Cups - Small - Black", "Type B Bra Cups - Small - White", "Type B Bra Cups - Medium - Black", "Type B Bra Cups - Medium - White", "Type B Bra Cups - Large - Black", "Type B Bra Cups - Large - White", "Type B Bra Cups - XL - Black", "Type B Bra Cups - XL - White", "Type B Bra Cups - XXL - Black", "Type B Bra Cups - XXL - White", "Type B Bra Cups - XXXL - Black", "Type B Bra Cups - XXXL - White", "Type C Bra Cups - Small - Black", "Type C Bra Cups - Small - White", "Type C Bra Cups - Medium - Black", "Type C Bra Cups - Medium - White", "Type C Bra Cups - Large - Black", "Type C Bra Cups - Large - White", "Type C Bra Cups - XL - Black", "Type C Bra Cups - XL - White", "Type C Bra Cups - XXL - Black", "Type C Bra Cups - XXL - White", "Type C Bra Cups - XXXL - Black", "Type C Bra Cups - XXXL - White", "Type D Bra Cups - Small - Black", "Type D Bra Cups - Small - White", "Type D Bra Cups - Medium - Black", "Type D Bra Cups - Medium - White", "Type D Bra Cups - Large - Black", "Type D Bra Cups - Large - White", "Type D Bra Cups - XL - Black", "Type D Bra Cups - XL - White", "Type D Bra Cups - XXL - Black", "Type D Bra Cups - XXL - White", "Type D Bra Cups - XXXL - Black", "Type D Bra Cups - XXXL - White"], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Bra Cups">
            <strong>Bra Cups</strong>
        </div>
    </div>
</div>
` + scriptHtml;

const bucklesOpts = Array.from({length: 20}, (_, i) => `Option ${i + 1}`);
const broachOpts = Array.from({length: 25}, (_, i) => `Option ${i + 1}`);

const bucklesHtml = `<div class="section">
    <h3>Buckles & Broaches</h3>
    <div class="grid">
        <div class="card" onclick='openModal("Buckles", "images/placeholder.jpg", ${JSON.stringify(bucklesOpts)}, "Select Option")'>
            <img src="images/placeholder.jpg" alt="Buckles">
            <strong>Buckles</strong>
        </div>
        <div class="card" onclick='openModal("Broaches", "images/placeholder.jpg", ${JSON.stringify(broachOpts)}, "Select Option")'>
            <img src="images/placeholder.jpg" alt="Broaches">
            <strong>Broaches</strong>
        </div>
    </div>
</div>
` + scriptHtml;

const macAccessHtml = `<div class="section">
    <h3>Machine Accessories</h3>
    <div class="grid">
        <div class="card" onclick='openModal("Globes", "images/placeholder.jpg", [], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Globes">
            <strong>Globes</strong>
        </div>
        <div class="card" onclick='openModal("Belts", "images/placeholder.jpg", [], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Belts">
            <strong>Belts</strong>
        </div>
        <div class="card" onclick='openModal("Oil", "images/placeholder.jpg", [], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Oil">
            <strong>Oil</strong>
        </div>
        <div class="card" onclick='openModal("Motors", "images/placeholder.jpg", [], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Motors">
            <strong>Motors</strong>
        </div>
        <div class="card" onclick='openModal("Bobbins", "images/placeholder.jpg", [], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Bobbins">
            <strong>Bobbins</strong>
        </div>
    </div>
</div>
` + scriptHtml;

const macPartsHtml = `<div class="section">
    <h3>Machine Parts</h3>
    <div class="grid">
        <div class="card" onclick='openModal("Cleaning Brushes", "images/placeholder.jpg", [], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Cleaning Brushes">
            <strong>Cleaning Brushes</strong>
        </div>
        <div class="card" onclick='openModal("Allen Keys", "images/placeholder.jpg", [], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Allen Keys">
            <strong>Allen Keys</strong>
        </div>
        <div class="card" onclick='openModal("Plates", "images/placeholder.jpg", [], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Plates">
            <strong>Plates</strong>
        </div>
        <div class="card" onclick='openModal("Zip Foots", "images/placeholder.jpg", [], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Zip Foots">
            <strong>Zip Foots</strong>
        </div>
        <div class="card" onclick='openModal("Piping Foots", "images/placeholder.jpg", [], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Piping Foots">
            <strong>Piping Foots</strong>
        </div>
        <div class="card" onclick='openModal("Hemmer Foots", "images/placeholder.jpg", [], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Hemmer Foots">
            <strong>Hemmer Foots</strong>
        </div>
        <div class="card" onclick='openModal("Shirring Foots", "images/placeholder.jpg", [], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Shirring Foots">
            <strong>Shirring Foots</strong>
        </div>
        <div class="card" onclick='openModal("Top Stitch Foots", "images/placeholder.jpg", [], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Top Stitch">
            <strong>Top Stitch</strong>
        </div>
        <div class="card" onclick='openModal("Presser Foots", "images/placeholder.jpg", [], "Select Product")'>
            <img src="images/placeholder.jpg" alt="Presser Foots">
            <strong>Presser Foots</strong>
        </div>
    </div>
</div>
` + scriptHtml;

const baseDir = "c:/Users/umara/OneDrive/Documents/codePulse websites/FAWZ23APR";
const files = [
    { name: "beadsAndKits.html", content: beadsHtml },
    { name: "BoningBraCupsShoulderPads.html", content: boningHtml },
    { name: "buckles&Broach.html", content: bucklesHtml },
    { name: "machineAccessories.html", content: macAccessHtml },
    { name: "machineParts.html", content: macPartsHtml }
];

files.forEach(f => {
    const fullPath = path.join(baseDir, f.name);
    try {
        updateFile(fullPath, f.content);
    } catch(err) {
        console.error("Error updating", f.name, err);
    }
});
