let commands = null; // Placeholder for commands from JSON file
let username = 'root'; // Dynamic username
let bashname = '.zsh'; // Simulated shell name
let terminal = document.querySelector('.terminal');
let terminalInfo = document.querySelector('.terminal-info');

// Function to update terminal info dynamically
function updateTerminalInfo() {
    const { clientWidth, clientHeight } = terminal;
    terminalInfo.textContent = `${username} - ${bashname} - ${clientWidth}x${clientHeight}`;
}

// Update terminal info on window resize
window.addEventListener('resize', updateTerminalInfo);
updateTerminalInfo(); // Initial call to set info

const typewriter = document.getElementById("typewriter");
let index = 0; // Index to track commands

// Load commands from an external JSON file
fetch('./json/commands.json')
    .then(response => {
        if (!response.ok) throw new Error('Failed to load commands.json');
        return response.json();
    })
    .then(data => {
        commands = data; // Store loaded commands
        runTerminal(); // Start terminal simulation
    })
    .catch(error => {
        console.error('Error loading commands:', error);
        typewriter.textContent = "Error loading commands. Please check the console for details.";
    });

// Function to execute a command and return its output
function executeCommand(command) {
    const matchedCommand = commands.find(c => c.command === command);
    return matchedCommand ? matchedCommand.result : `Command not found: ${command}`;
}

// Simulate typing a line with a typewriter effect
function typeLine(line, callback) {
    let i = 0;
    const cursor = `<span class="cursor"></span>`;
    const interval = setInterval(() => {
        typewriter.innerHTML = typewriter.innerHTML.replace(cursor, "") + line[i] + cursor;
        i++;
        typewriter.scrollTop = typewriter.scrollHeight; // Auto-scroll to the bottom
        if (i === line.length) {
            clearInterval(interval);
            typewriter.innerHTML = typewriter.innerHTML.replace(cursor, ""); // Remove cursor
            if (callback) callback();
        }
    }, 30);
}

// Display command output without typing animation
function displayOutput(output, callback) {
    typewriter.innerHTML += output + "\n";
    typewriter.scrollTop = typewriter.scrollHeight; // Auto-scroll to the bottom
    if (callback) callback();
}

// Simulate terminal operations with commands
function runTerminal() {
    if (!commands || index >= commands.length) return; // Stop if no commands or end reached

    const command = commands[index].command;
    typeLine(`root@mac-terminal:~$ ${command}\n`, () => {
        const result = executeCommand(command); // Get result for the command
        setTimeout(() => {
            displayOutput(result, () => {
                index++; // Move to the next command
                setTimeout(runTerminal, 500); // Delay before next command
            });
        }, 10);
    });
}