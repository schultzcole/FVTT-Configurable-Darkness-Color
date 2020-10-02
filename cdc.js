let defaultDarknessColor = 0x000000;

Hooks.on("init", () => {
    defaultDarknessColor = PIXI.utils.hex2string(CONFIG.Canvas.darknessColor);

    const super_onChangeColorPicker = SceneConfig.prototype._onChangeColorPicker;
    SceneConfig.prototype._onChangeColorPicker = function (event) {
        super_onChangeColorPicker.call(this, event);
        const picker = event.target;
        if (picker.id === "darknessColorPicker" && this.object.isView) {
            CONFIG.Canvas.darknessColor = PIXI.utils.string2hex(picker.value ?? defaultDarknessColor);
            canvas.lighting.refresh();
        }
    };
});

Hooks.on("canvasInit", (canvas) => {
    CONFIG.Canvas.darknessColor = PIXI.utils.string2hex(
        canvas.scene.getFlag("darkness-color", "darknessColor") ?? defaultDarknessColor
    );
});

Hooks.on("renderSceneConfig", (app, html, appData) => {
    const currentColor = appData.entity.flags["darkness-color"]?.darknessColor ?? defaultDarknessColor;

    const darknessSliderGroup = html.find("[name=darkness]").closest(".form-group");
    darknessSliderGroup.after(darknessColorElement(currentColor));
});

function darknessColorElement(currentColor) {
    const darknessColorLabel = "Darkness Color";
    const darknessColorHint = "Changes the color of the darkness overlay.";
    return `
        <div class="form-group">
            <label>${darknessColorLabel}</label>
            <div class="form-fields">
                <input type="text" name="flags.darkness-color.darknessColor" value="${currentColor}" data-dtype="String"/>
                <input type="color" id="darknessColorPicker" value="${currentColor}" data-edit="flags.darkness-color.darknessColor"/>
            </div>
            <p class="notes">${darknessColorHint}</p>
        </div >
    `;
}
