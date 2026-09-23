const CPUMicrocodes = {
    WR_EAX: 0x01, WR_EBX: 0x02, WR_ECX: 0x03, WR_EDX: 0x04,
    WR_ESP: 0x05, WR_EBP: 0x06, WR_ESI: 0x07, WR_EDI: 0x08,
    WR_EIP: 0x09, ADD: 0x0A, SUB: 0x0B, MUL: 0x0C,
    DIV: 0x0D, AND: 0x0E, OR: 0x0F, XOR: 0x10,
    NOT: 0x11, WR_FLAGS: 0x12, SET_PROT: 0x13, CLR_PROT: 0x14,
    WR_GDTB: 0x15, WR_GDTL: 0x16, STK_PUSH: 0x17, STK_POP: 0x18,
    MOV_AB: 0x19, AI_GEN: 0x1A, AI_POPCNT: 0x1B, AI_ROTL: 0x1C,
    AI_MIX: 0x1D, JZ: 0x1E, JNZ: 0x1F, SHL: 0x20, 
    SHR: 0x21, AI_FLIP: 0x22
};

class MemoryBuffer {
    constructor() {
        this.size = 153600;
        this.arrayBuffer = new ArrayBuffer(this.size);
        this.view = new DataView(this.arrayBuffer);
        this.uint8 = new Uint8Array(this.arrayBuffer);
    }

    wb(addr, val) {
        this.uint8[addr % this.size] = val & 0xFF;
    }

    rb(addr) {
        return this.uint8[addr % this.size];
    }

    wl(addr, val) {
        this.view.setUint32(addr % (this.size - 3), val >>> 0, true);
    }

    rl(addr) {
        return this.view.getUint32(addr % (this.size - 3), true);
    }
}

async function initBonziCPU(wasmUrl = './BonziCPU.wasm') {
    const response = await fetch(wasmUrl);
    const wasmModule = await WebAssembly.instantiateStreaming(response);
    const cpu = wasmModule.instance.exports;
    const mem = new MemoryBuffer();

    return { cpu, mem, CPUMicrocodes };
}

window.initBonziCPU = initBonziCPU;
window.CPUMicrocodes = CPUMicrocodes;
window.MemoryBuffer = MemoryBuffer;