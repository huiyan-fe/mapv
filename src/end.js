
    if (typeof define === "function" && define.amd) {
        define(Mapv);
    } else if (typeof module === "object" && module.exports) {
        module.exports = Mapv;
    }

    this.Mapv = Mapv;

}();
