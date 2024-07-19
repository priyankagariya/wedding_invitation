function changeFont(font) {
    document.getElementById('card').style.fontFamily = font;
}


let undoStack = [];
let redoStack = [];
const card = document.getElementById('card');

function saveState() {
    const state = {
        html: card.innerHTML,
        positions: Array.from(card.children).map(child => ({
            id: child.id,
            top: child.style.top,
            left: child.style.left
        }))
    };
    undoStack.push(state);
    redoStack = [];
}

card.addEventListener('input', saveState);

function changeFont(font) {
    Array.from(card.children).forEach(child => {
        child.style.fontFamily = font;
    });
    saveState();
}

function undo() {
    if (undoStack.length > 0) {
        redoStack.push({
            html: card.innerHTML,
            positions: Array.from(card.children).map(child => ({
                id: child.id,
                top: child.style.top,
                left: child.style.left
            }))
        });
        const prevState = undoStack.pop();
        card.innerHTML = prevState.html;
        prevState.positions.forEach(pos => {
            const element = document.getElementById(pos.id);
            element.style.top = pos.top;
            element.style.left = pos.left;
        });
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push({
            html: card.innerHTML,
            positions: Array.from(card.children).map(child => ({
                id: child.id,
                top: child.style.top,
                left: child.style.left
            }))
        });
        const nextState = redoStack.pop();
        card.innerHTML = nextState.html;
        nextState.positions.forEach(pos => {
            const element = document.getElementById(pos.id);
            element.style.top = pos.top;
            element.style.left = pos.left;
        });
    }
}

function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

card.ondragover = function(event) {
    event.preventDefault();
};

card.ondrop = function(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    const element = document.getElementById(id);
    const rect = card.getBoundingClientRect();
    element.style.top = (event.clientY - rect.top - element.offsetHeight / 2) + "px";
    element.style.left = (event.clientX - rect.left - element.offsetWidth / 2) + "px";
    saveState();
};

function changeFontSize(action) {
    Array.from(card.children).forEach(child => {
        let currentSize = parseFloat(window.getComputedStyle(child).fontSize);
        if (action === 'increase') {
            child.style.fontSize = (currentSize + 2) + 'px';
        } else if (action === 'decrease') {
            child.style.fontSize = (currentSize - 2) + 'px';
        }
    });
    saveState();
}

function changeColor(event) {
    Array.from(card.children).forEach(child => {
        child.style.color = event.target.value;
    });
    saveState();
}

saveState();
