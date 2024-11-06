document.getElementById('partsCost').addEventListener('input', calculateTotal);
document.getElementById('laborCost').addEventListener('input', calculateTotal);

function calculateTotal() {
    const partsCost = parseFloat(document.getElementById('partsCost').value) || 0;
    const laborCost = parseFloat(document.getElementById('laborCost').value) || 0;
    const totalCost = partsCost + laborCost;
    document.getElementById('totalCost').value = totalCost.toFixed(2);
}
