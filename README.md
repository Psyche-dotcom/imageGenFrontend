# SCP ACS Bar Gen

## How to use
First configure the variables in the script in line 6 to 15:
- `c_text_item_number` is the Number of the SCP. It should be a number between 100 and 9999
- `sizeFactor` is the size of the Image that is being generated. Since diffrent styles have diffrent sizes, this variable is used to scale the image to the correct size. Value 1 should be only used for the preview image as it is otherwise to small. **Do not change the value of c_height and c_width as they are used to calculate the size of the image.**
- `clearance_level` is the clearnance level of the SCP. This can be any value defined in libary/<SelectedStyle>/config.json/clearance-level (e.g. `1`)
- `contaiment_class` is the contaiment class of the SCP. This can be any value defined in libary/<SelectedStyle>/config.json/containment-class (e.g. `safe`)
- `secondary_class` is a **optional** value. It can be any value defined in libary/<SelectedStyle>/config.json/secondary-class (e.g. `apollyon`)
- `disruption_class` is the disruption level of the SCP. This can be any value defined in libary/<SelectedStyle>/config.json/disruption-class (e.g. `1`)
- `risk_class` is the risk level of the SCP. This can be any value defined in libary/<SelectedStyle>/config.json/risk-class (e.g. `1`)
- `opacityBackground` is the opacity of the background. This can either be 0 or 1.
- `theme` is which theme should be used to generate the image. This can be a number between 0 and 3. 0 is the default theme, 1 is the Hybrid theme, 2 is the Textual theme and 3 is the Splitter theme.
- `type` defines which image should be generated. This either can be `png` or `svg`.
- `iconpack` defines which iconpack should be used. Since I currenty only have two iconpacks, this can be either `default` or `extended_secondary`.

After the values are configured and the currently function is selected, the script can be run with `node index.js` and the images will be generated in the `output` folder.
If you want for testing to generate Images all few seconds you can use `while true; do node index.js; sleep 5` to run the script every 5 seconds.