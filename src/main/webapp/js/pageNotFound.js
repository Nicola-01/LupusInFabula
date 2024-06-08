document.addEventListener('DOMContentLoaded', function (event) {
    loadTheme();

    $(".patch").each((i) => {
        let b = i + 1;
        let rX = Math.floor(Math.random() * 50);
        let rY = Math.floor(Math.random() * 100);
        let rH = Math.floor(Math.random() * 10) + 15;
        $(".patch:nth-child(" + b + ")").css({
            left: i - 1 + "vw",
            height: rH + "vh",
            "-webkit-clip-path": "polygon(" + rX + "% " + rX + "%, 0% 100%, 100% 100%)",
            "clip-path": "polygon(" + rX + "% " + rX + "%, 0% 100%, 100% 100%)"
        });
    });


    $(".tree").each((i) => {
        let b = i + 1;

        // 0 top
        // 0 left

        let treeHeight = Math.floor(Math.random() * 2 + 3);
        let nNodes = treeHeight * 4 + 1;
        let posNodesH = new Array(treeHeight * 4 + 1);
        let posNodesW = new Array(treeHeight * 4 + 1);

        let nodeH = 100 / treeHeight; // difference of height of rodes (%)
        let internalNodeH = Math.floor(Math.random() * 4 + 25 / treeHeight); // difference of height of rodes (%)

        let nodeW = (50 / treeHeight); // difference of width of rodes (%)
        let internalNodeW = Math.floor(Math.random() * 3 + 27 / treeHeight); // difference of width of rodes (%)

        posNodesH[0] = 0;
        posNodesW[0] = 50;

        for (let j = 1; j <= treeHeight * 2; j++) {
            if (j % 2 === 1) {
                posNodesH[j] = posNodesH[j - 1] + nodeH;
                posNodesW[j] = posNodesW[j - 1] - nodeW;
            } else {
                posNodesH[j] = posNodesH[j - 1] - internalNodeH;
                posNodesW[j] = posNodesW[j - 1] + internalNodeW;
            }
            posNodesH[nNodes - j] = posNodesH[j];
            posNodesW[nNodes - j] = 100 - posNodesW[j];
        }
        let scaleH = 100 / Math.max(...posNodesH);
        let scaleW = 50 / (Math.max(...posNodesW) - 50);

        posNodesH[treeHeight * 2] = 100 / scaleH;
        posNodesW[treeHeight * 2] = 50;
        posNodesH[treeHeight * 2 + 1] = 100 / scaleH;
        posNodesW[treeHeight * 2 + 1] = 50;

        // Constructing the polygon points from the arrays
        let polygonPoints = "50% 0%,";

        // " + rX + "% " + rX + "%, 0% 100%, 100% 100%
        for (let k = 1; k < nNodes; k++) {
            let posW = posNodesW[k];
            if (posW > 50)
                posW = 50 + (posW - 50) * scaleW;
            else
                posW = 50 + (posW - 50) * scaleW

            polygonPoints += "" + posW + "% " + posNodesH[k] * scaleH + "%, ";
        }

        polygonPoints = polygonPoints.substring(0, polygonPoints.length - 2);

        let rX = Math.floor(Math.random() * 110 - 5);
        let rH = Math.random() * 10 + 15;
        let rW = Math.random() * 2 + 14;
        let rR =
            Math.floor(Math.random() * 3) *
            Math.cos(Math.PI * Math.round(Math.random()));
        $(".tree:nth-child(" + i + ")").css({
            // left: ((i - 2) * 5) + rX + "vw",
            left: rX + "vw",
            height: rH + "em",
            width: rW + "em",
            // left: "3vw",
            bottom: "3dvw",
            transform: "rotateZ(" + rR + "deg)",
            "-webkit-clip-path": "polygon(" + polygonPoints + ")",
            "clip-path": "polygon(" + polygonPoints + ")"
        }).addClass("tree" + (3 - Math.floor(Math.random() * 5 + 1) % 3));
    });

    $(".cross").each((i) => {
        let b = i + 1;
        let rR =
            Math.floor(Math.random() * 15) *
            Math.cos(Math.PI * Math.round(Math.random()));
        $(".cross:nth-child(" + b + ")").css({
            transform: "rotateZ(" + rR + "deg)"
        });
    });

    $(".star").each((i) => {
        $(".star:nth-child(" + i + ")").css({
            top: Math.random() * $(document).height() - $(document).height() / 4,
            left: Math.random() * $(document).width()
        });
    });

    init = () => {
        $(".crypt").css({
            transform:
                "translateX(-50%) rotateZ(" +
                Math.floor(Math.random() * 5) *
                Math.cos(Math.PI * Math.round(Math.random())) +
                "deg)"
        });
        $(".title").animate(
            {
                top: "25%"
            },
            5000,
            () => {
                $(".title").addClass("life");
                $(".msg").fadeIn(1000);
            }
        );
    };
    init();

});