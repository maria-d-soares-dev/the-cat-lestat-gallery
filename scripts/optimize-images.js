const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const projectDirectory = path.resolve(__dirname, "..");
const sourceDirectory = path.join(projectDirectory, "images");
const outputDirectory = path.join(sourceDirectory, "optimized");

const acceptedExtensions = new Set([
    ".jpg",
    ".jpeg",
    ".png"
]);

async function optimizeImages() {
    await fs.mkdir(outputDirectory, { recursive: true });

    const files = await fs.readdir(sourceDirectory);

    const imageFiles = files.filter((file) => {
        const extension = path.extname(file).toLowerCase();

        return acceptedExtensions.has(extension);
    });

    if (imageFiles.length === 0) {
        console.log("No images were found.");
        return;
    }

    let originalTotal = 0;
    let optimizedTotal = 0;

    console.log(`Found ${imageFiles.length} images.\n`);

    for (const file of imageFiles) {
        const sourcePath = path.join(sourceDirectory, file);
        const outputName =
            `${path.parse(file).name}.webp`;
        const outputPath =
            path.join(outputDirectory, outputName);

        const originalInformation = await fs.stat(sourcePath);

        await sharp(sourcePath)
            .rotate()
            .resize({
                width: 1600,
                withoutEnlargement: true
            })
            .webp({
                quality: 82
            })
            .toFile(outputPath);

        const optimizedInformation = await fs.stat(outputPath);

        originalTotal += originalInformation.size;
        optimizedTotal += optimizedInformation.size;

        console.log(
            `${file} -> optimized/${outputName}`
        );
    }

    const savedBytes = originalTotal - optimizedTotal;
    const savedPercentage =
        originalTotal === 0
            ? 0
            : (savedBytes / originalTotal) * 100;

    console.log("\nOptimization completed.");
    console.log(
        `Original size: ${formatBytes(originalTotal)}`
    );
    console.log(
        `Optimized size: ${formatBytes(optimizedTotal)}`
    );
    console.log(
        `Reduction: ${savedPercentage.toFixed(1)}%`
    );
}

function formatBytes(bytes) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

optimizeImages().catch((error) => {
    console.error("Image optimization failed:");
    console.error(error);
    process.exitCode = 1;
});
