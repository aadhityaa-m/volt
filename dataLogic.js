// --- Big Data Engine & Analytics Logic ---

/**
 * Generates ~2 years of minute-level data (~1M points) client-side.
 * Stores result in state.bigData
 */
function generateBigData() {
    console.log("Starting Big Data Generation...");
    // Start Date: 2 Years Ago
    let currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 2);

    const data = [];
    const TWO_YEARS_MINUTES = 60 * 24 * 365 * 2;

    // Base Load factors
    const morningPeak = { start: 6, end: 9, mult: 2.5 };
    const eveningPeak = { start: 18, end: 22, mult: 3.0 };

    let val = 500; // Base watts

    for (let i = 0; i < TWO_YEARS_MINUTES; i++) {
        currentDate.setMinutes(currentDate.getMinutes() + 1);
        const hour = currentDate.getHours();
        const month = currentDate.getMonth(); // 0-11
        const isSummer = month >= 3 && month <= 6; // India Summer (Apr-July)
        const isWinter = month >= 10 || month <= 1;

        // Seasonal Multiplier
        let seasonalMult = 1.0;
        if (isSummer) seasonalMult = 1.8; // AC Load
        if (isWinter) seasonalMult = 0.8;

        // Daily Profile
        let timeMult = 1.0;
        if (hour >= morningPeak.start && hour <= morningPeak.end) timeMult = morningPeak.mult;
        else if (hour >= eveningPeak.start && hour <= eveningPeak.end) timeMult = eveningPeak.mult;
        else if (hour >= 1 && hour <= 5) timeMult = 0.4; // Night low

        // Random Noise
        let noise = (Math.random() - 0.5) * 200;

        val = (400 * timeMult * seasonalMult) + noise;
        if (val < 50) val = 50;

        // Minimalistic storage to save RAM: [Value (Watts)]
        data.push(Math.round(val));
    }

    if (typeof state !== 'undefined') {
        state.bigData = data;
        state.bigDataStartDate = new Date();
        state.bigDataStartDate.setFullYear(state.bigDataStartDate.getFullYear() - 2);
    }
    console.log(`Generated ${data.length} data points.`);
}

/**
 * Reduces large datasets for chart rendering using simple block averaging.
 * @param {Array} data - Raw data array
 * @param {number} targetCount - Desired number of points
 * @returns {Array} Downsampled array
 */
function downsample(data, targetCount) {
    if (!data || data.length === 0) return [];
    const blockSize = Math.floor(data.length / targetCount);
    const sampled = [];

    for (let i = 0; i < data.length; i += blockSize) {
        let sum = 0;
        let count = 0;
        for (let j = 0; j < blockSize && (i + j) < data.length; j++) {
            sum += data[i + j];
            count++;
        }
        sampled.push(sum / count);
    }
    return sampled;
}

/**
 * Updates the Analytics View based on selected time range.
 * @param {string} range - 'month', 'year', 'all'
 */
function updateAnalytics(range) {
    if (!state.bigData || !state.bigData.length) return;

    // Highlight Buttons
    ['month', 'year', 'all'].forEach(r => {
        const btn = document.getElementById(`btn-${r}`);
        if (btn) {
            if (r === range) {
                btn.classList.remove('hover:bg-stone-100', 'dark:hover:bg-white/10', 'text-stone-500', 'dark:text-stone-400', 'bg-transparent');
                btn.classList.add('bg-orange-100', 'text-orange-700', 'dark:bg-orange-500/20', 'dark:text-orange-300');
            } else {
                btn.classList.add('hover:bg-stone-100', 'dark:hover:bg-white/10', 'text-stone-500', 'dark:text-stone-400', 'bg-transparent');
                btn.classList.remove('bg-orange-100', 'text-orange-700', 'dark:bg-orange-500/20', 'dark:text-orange-300');
            }
        }
    });

    // Filter Data
    let sliceStart = 0;
    const totalMinutes = state.bigData.length;

    if (range === 'month') sliceStart = totalMinutes - (30 * 24 * 60);
    if (range === 'year') sliceStart = totalMinutes - (365 * 24 * 60);

    if (sliceStart < 0) sliceStart = 0;

    const relevantData = state.bigData.slice(sliceStart);

    // Calculate Stats
    let sumWatts = 0;
    let peakWatts = 0;

    // Use a simple loop for performance over reduce
    for (let i = 0; i < relevantData.length; i++) {
        const w = relevantData[i];
        sumWatts += w;
        if (w > peakWatts) peakWatts = w;
    }

    const totalKwh = (sumWatts / 1000 / 60); // Watts / 1000 * 1 min (1/60 hr)

    // Update DOM
    const elTotal = document.getElementById('analytics-total');
    const elPeak = document.getElementById('analytics-peak');
    const elPoints = document.getElementById('analytics-points');

    if (elTotal) elTotal.innerText = Math.round(totalKwh).toLocaleString();
    if (elPeak) elPeak.innerText = (peakWatts / 1000).toFixed(2);
    if (elPoints) elPoints.innerText = relevantData.length.toLocaleString();

    // Chart Render (Downsampled to 200 points)
    const downsampled = downsample(relevantData, 200);
    renderAnalyticsChart(downsampled, range);
}

/**
 * Renders the Analytics Chart using Chart.js
 */
function renderAnalyticsChart(data, range) {
    const ctx = document.getElementById('analyticsChart')?.getContext('2d');
    if (!ctx) return;

    // Labels (Simple X Indices for now, could be improved dates)
    const labels = data.map((_, i) => i);

    if (state.charts.analytics) {
        state.charts.analytics.destroy();
    }

    // Determine colors based on current theme check from DOM
    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : '#f5f5f4';
    const tickColor = isDark ? '#a8a29e' : '#78716c';

    state.charts.analytics = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Load (W)',
                data: data,
                borderColor: '#2dd4bf',
                backgroundColor: 'rgba(45, 212, 191, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 500 },
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: gridColor },
                    ticks: { color: tickColor }
                },
                x: { display: false }
            }
        }
    });
}
