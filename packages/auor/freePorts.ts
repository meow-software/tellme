import { exec } from "child_process";

// npx ts-node ./packages/auor/freePorts.ts    

// Plage de ports à libérer
const ports = [3001, 3002, 3003];

function libererPort(port: number) {
  exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
    if (err || !stdout) {
      console.log(`🟢 Port ${port} est déjà libre.`);
      return;
    }

    // Extraction du PID
    const lines = stdout.trim().split("\n");
    const pids = new Set<string>();

    lines.forEach((line) => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5) {
        pids.add(parts[parts.length - 1]); // PID est le dernier élément
      }
    });

    // Tuer les processus trouvés
    pids.forEach((pid) => {
      console.log(`🔴 Port ${port} utilisé par le processus ${pid}. Tentative de fermeture...`);
      exec(`taskkill /PID ${pid} /F`, (killErr) => {
        if (killErr) {
          console.log(`❌ Impossible de fermer le processus ${pid}.`);
        } else {
          console.log(`✅ Port ${port} libéré !`);
        }
      });
    });
  });
}

// Exécuter pour chaque port
ports.forEach((port) => libererPort(port));
