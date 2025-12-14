import { IInputs, IOutputs } from "./generated/ManifestTypes";

// Country data type definition
interface Country {
    code: string;
    name: string;
    dialCode: string;
    flag: string;
    format: string;
    minLength: number;
    maxLength: number;
}

export class CountryPhoneFormatter implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    // CSS styles
    private static STYLES = {
        container: "cpf-container",
        countrySelect: "cpf-country-select",
        phoneInput: "cpf-phone-input",
        countryDisplay: "cpf-country-display",
        phoneContainer: "cpf-phone-container",
        prefix: "cpf-prefix"
    };

    // COUNTRY DATA with Arabic names and flags
      private static COUNTRIES = [
        // Middle East & North Africa
        { code: "jo", name: "Jordan", dialCode: "+962", flag: "🇯🇴", format: "xx xxx xxxx", minLength: 9, maxLength: 10 },
        { code: "sa", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦", format: "xx xxx xxxx", minLength: 9, maxLength: 9 },
        { code: "ae", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪", format: "xx xxx xxxx", minLength: 9, maxLength: 9 },
        { code: "eg", name: "Egypt", dialCode: "+20", flag: "🇪🇬", format: "xx xxx xxxx", minLength: 10, maxLength: 10 },
        { code: "qa", name: "Qatar", dialCode: "+974", flag: "🇶🇦", format: "xx xxx xxxx", minLength: 8, maxLength: 8 },
        { code: "lb", name: "Lebanon", dialCode: "+961", flag: "🇱🇧", format: "xx xxx xxxx", minLength: 8, maxLength: 8 },
        { code: "sy", name: "Syria", dialCode: "+963", flag: "🇸🇾", format: "xx xxx xxxx", minLength: 9, maxLength: 9 },
        { code: "iq", name: "Iraq", dialCode: "+964", flag: "🇮🇶", format: "xx xxx xxxx", minLength: 10, maxLength: 10 },
        { code: "kw", name: "Kuwait", dialCode: "+965", flag: "🇰🇼", format: "xx xxx xxxx", minLength: 8, maxLength: 8 },
        { code: "bh", name: "Bahrain", dialCode: "+973", flag: "🇧🇭", format: "xx xxx xxxx", minLength: 8, maxLength: 8 },
        { code: "om", name: "Oman", dialCode: "+968", flag: "🇴🇲", format: "xx xxx xxxx", minLength: 8, maxLength: 8 },
        { code: "ye", name: "Yemen", dialCode: "+967", flag: "🇾🇪", format: "xx xxx xxxx", minLength: 9, maxLength: 9 },
        { code: "ps", name: "Palestine", dialCode: "+970", flag: "🇵🇸", format: "xx xxx xxxx", minLength: 9, maxLength: 9 },
        
        // North America
        { code: "us", name: "United States", dialCode: "+1", flag: "🇺🇸", format: "(xxx) xxx-xxxx", minLength: 10, maxLength: 10 },
        { code: "ca", name: "Canada", dialCode: "+1", flag: "🇨🇦", format: "(xxx) xxx-xxxx", minLength: 10, maxLength: 10 },
        { code: "mx", name: "Mexico", dialCode: "+52", flag: "🇲🇽", format: "xxx xxx xxxx", minLength: 10, maxLength: 10 },
        
        // Europe
        { code: "gb", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧", format: "xxxx xxx xxx", minLength: 10, maxLength: 10 },
        { code: "fr", name: "France", dialCode: "+33", flag: "🇫🇷", format: "x xx xx xx xx", minLength: 9, maxLength: 9 },
        { code: "de", name: "Germany", dialCode: "+49", flag: "🇩🇪", format: "xxxx xxxxxxx", minLength: 10, maxLength: 11 },
        { code: "it", name: "Italy", dialCode: "+39", flag: "🇮🇹", format: "xxx xxx xxxx", minLength: 9, maxLength: 10 },
        { code: "es", name: "Spain", dialCode: "+34", flag: "🇪🇸", format: "xxx xxx xxx", minLength: 9, maxLength: 9 },
        { code: "ru", name: "Russia", dialCode: "+7", flag: "🇷🇺", format: "xxx xxx-xx-xx", minLength: 10, maxLength: 10 },
        { code: "tr", name: "Turkey", dialCode: "+90", flag: "🇹🇷", format: "xxx xxx xxxx", minLength: 10, maxLength: 10 },
        
        // Asia & Pacific
        { code: "cn", name: "China", dialCode: "+86", flag: "🇨🇳", format: "xxx xxxx xxxx", minLength: 11, maxLength: 11 },
        { code: "in", name: "India", dialCode: "+91", flag: "🇮🇳", format: "xxxxx xxxxx", minLength: 10, maxLength: 10 },
        { code: "jp", name: "Japan", dialCode: "+81", flag: "🇯🇵", format: "xx xxxx xxxx", minLength: 10, maxLength: 10 },
        { code: "au", name: "Australia", dialCode: "+61", flag: "🇦🇺", format: "x xxxx xxxx", minLength: 9, maxLength: 9 },
        { code: "pk", name: "Pakistan", dialCode: "+92", flag: "🇵🇰", format: "xxx xxx xxxx", minLength: 10, maxLength: 10 },
        { code: "af", name: "Afghanistan", dialCode: "+93", flag: "🇦🇫", format: "xx xxx xxxx", minLength: 9, maxLength: 9 },
        { code: "ir", name: "Iran", dialCode: "+98", flag: "🇮🇷", format: "xxx xxx xxxx", minLength: 10, maxLength: 10 }
    ];

    private _notifyOutputChanged!: () => void;
    private _container!: HTMLDivElement;
    private _context!: ComponentFramework.Context<IInputs>;
    
    private _selectedCountry = CountryPhoneFormatter.COUNTRIES[0]; // Default: Jordan
    private _phoneNumber = "";
    
    private countrySelect!: HTMLSelectElement;
    private phoneInput!: HTMLInputElement;
    private prefixDisplay!: HTMLSpanElement;

    constructor() {}

    // INITIALIZATION ---------------------------------------------------
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;

        this.initializeStyles();
        this.createUI();
        this.bindEvents();
        
        // Restore state if exists
        if (state && state.selectedCountryCode) {
            const savedCountry = CountryPhoneFormatter.COUNTRIES.find(
                c => c.code === state.selectedCountryCode
            );
            if (savedCountry) {
                this._selectedCountry = savedCountry;
            }
        }
    }

    private initializeStyles(): void {
        const style = document.createElement('style');
        style.textContent = `
            .${CountryPhoneFormatter.STYLES.container} {
                font-family: 'Segoe UI', 'Segoe UI Arabic', Tahoma, Geneva, Verdana, sans-serif;
                width: 100%;
            }
            
            .${CountryPhoneFormatter.STYLES.countrySelect} {
                width: 100%;
                height: 32px;
                padding: 0 8px;
                margin-bottom: 8px;
                font-size: 14px;
                font-family: inherit;
                border: 1px solid #8A8886;
                border-radius: 2px;
                background-color: white;
                color: #323130;
                cursor: pointer;
            }
            
            .${CountryPhoneFormatter.STYLES.countrySelect}:focus {
                border-color: #0078D4;
                outline: none;
                box-shadow: 0 0 0 3px rgba(0, 120, 212, 0.3);
            }
            
            .${CountryPhoneFormatter.STYLES.countrySelect}:hover {
                border-color: #323130;
            }
            
            .${CountryPhoneFormatter.STYLES.countryDisplay} {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                font-size: 13px;
                color: #605E5C;
            }
            
            .${CountryPhoneFormatter.STYLES.phoneContainer} {
                display: flex;
                align-items: center;
                border: 1px solid #8A8886;
                border-radius: 2px;
                background-color: white;
                transition: border-color 0.2s;
            }
            
            .${CountryPhoneFormatter.STYLES.phoneContainer}:hover {
                border-color: #323130;
            }
            
            .${CountryPhoneFormatter.STYLES.phoneContainer}.focused {
                border-color: #0078D4;
                box-shadow: 0 0 0 3px rgba(0, 120, 212, 0.3);
            }
            
            .${CountryPhoneFormatter.STYLES.prefix} {
                padding: 6px 8px;
                font-size: 14px;
                color: #323130;
                background-color: #F3F2F1;
                border-right: 1px solid #8A8886;
                min-width: 70px;
                text-align: center;
                user-select: none;
            }
            
            .${CountryPhoneFormatter.STYLES.phoneInput} {
                flex: 1;
                height: 32px;
                padding: 0 8px;
                font-size: 14px;
                font-family: inherit;
                border: none;
                outline: none;
                background: transparent;
                color: #323130;
            }
            
            .${CountryPhoneFormatter.STYLES.phoneInput}::placeholder {
                color: #A19F9D;
            }
            
            /* RTL Support */
            [dir="rtl"] .${CountryPhoneFormatter.STYLES.prefix} {
                border-right: none;
                border-left: 1px solid #8A8886;
            }
            
            /* Dark Mode Support */
            @media (prefers-color-scheme: dark) {
                .${CountryPhoneFormatter.STYLES.countrySelect},
                .${CountryPhoneFormatter.STYLES.phoneInput} {
                    background-color: #2D2C2C;
                    color: #F3F2F1;
                    border-color: #605E5C;
                }
                
                .${CountryPhoneFormatter.STYLES.prefix} {
                    background-color: #3B3A39;
                    color: #F3F2F1;
                    border-color: #605E5C;
                }
                
                .${CountryPhoneFormatter.STYLES.phoneContainer} {
                    border-color: #605E5C;
                    background-color: #2D2C2C;
                }
                
                .${CountryPhoneFormatter.STYLES.countrySelect}:hover,
                .${CountryPhoneFormatter.STYLES.phoneContainer}:hover {
                    border-color: #A19F9D;
                }
                
                .${CountryPhoneFormatter.STYLES.countrySelect}:focus,
                .${CountryPhoneFormatter.STYLES.phoneContainer}.focused {
                    border-color: #0078D4;
                }
            }
        `;
        document.head.appendChild(style);
    }

    private createUI(): void {
        this._container.innerHTML = `
            <div class="${CountryPhoneFormatter.STYLES.container}">
                <select class="${CountryPhoneFormatter.STYLES.countrySelect}" id="country-select">
                    ${this.generateCountryOptions()}
                </select>
                
                <div class="${CountryPhoneFormatter.STYLES.countryDisplay}" id="country-display">
                    ${this._selectedCountry.flag} (${this._selectedCountry.dialCode})
                </div>
                
                <div class="${CountryPhoneFormatter.STYLES.phoneContainer}" id="phone-container">
                    <span class="${CountryPhoneFormatter.STYLES.prefix}" id="phone-prefix">
                        ${this._selectedCountry.dialCode}
                    </span>
                    <input 
                        type="tel" 
                        class="${CountryPhoneFormatter.STYLES.phoneInput}" 
                        id="phone-input"
                        placeholder="e.g., 07X XXX XXXX"
                        dir="ltr"
                    />
                </div>
            </div>
        `;

        this.countrySelect = this._container.querySelector("#country-select") as HTMLSelectElement;
        this.phoneInput = this._container.querySelector("#phone-input") as HTMLInputElement;
        this.prefixDisplay = this._container.querySelector("#phone-prefix") as HTMLSpanElement;
    }

    private generateCountryOptions(): string {
        return CountryPhoneFormatter.COUNTRIES
            .map(country => {
                return `
                    <option value="${country.code}" 
                            data-dial="${country.dialCode}"
                            data-flag="${country.flag}">
                        ${country.flag} ${country.name} (${country.dialCode})
                    </option>
                `;
            })
            .join('');
    }

    private bindEvents(): void {
        // Country select change
        this.countrySelect.addEventListener("change", (e) => {
            const selectedCode = (e.target as HTMLSelectElement).value;
            const selectedCountry = CountryPhoneFormatter.COUNTRIES.find(
                c => c.code === selectedCode
            );
            
            if (selectedCountry) {
                this._selectedCountry = selectedCountry;
                this.updateDisplay();
                this.formatPhoneNumber();
            }
        });

        // Phone input events
        this.phoneInput.addEventListener("focus", () => {
            const container = this._container.querySelector(`.${CountryPhoneFormatter.STYLES.phoneContainer}`);
            container?.classList.add("focused");
        });

        this.phoneInput.addEventListener("blur", () => {
            const container = this._container.querySelector(`.${CountryPhoneFormatter.STYLES.phoneContainer}`);
            container?.classList.remove("focused");
            this.formatPhoneNumber();
        });

        this.phoneInput.addEventListener("input", (e) => {
            const input = e.target as HTMLInputElement;
            // Allow only numbers, plus, spaces, and dashes
            input.value = input.value.replace(/[^\d+\s\-]/g, '');
            this._phoneNumber = input.value;
            this.savePhoneNumber();
        });

        // Auto-format on paste
        this.phoneInput.addEventListener("paste", (e) => {
            e.preventDefault();
            const pastedText = e.clipboardData?.getData('text') || '';
            const cleanText = pastedText.replace(/[^\d+\s\-]/g, '');
            this.phoneInput.value = cleanText;
            this._phoneNumber = cleanText;
            this.savePhoneNumber();
        });
    }

    // UPDATE VIEW ---------------------------------------------------
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._context = context;
        
        // Update from bound field if available
        const boundCountry = this.extractCountry(context);
        const boundPhone = context.parameters.phone?.raw?.toString() || "";
        
        if (boundCountry) {
            const foundCountry = CountryPhoneFormatter.COUNTRIES.find(
                c => c.name.toLowerCase() === boundCountry.toLowerCase()
            );
            
            if (foundCountry && foundCountry.code !== this._selectedCountry.code) {
                this._selectedCountry = foundCountry;
                this.updateDisplay();
            }
        }
        
        if (boundPhone && boundPhone !== this.getFullPhoneNumber()) {
            this.processPhoneInput(boundPhone);
        }
    }

    private extractCountry(context: ComponentFramework.Context<IInputs>): string | null {
        const prop = context.parameters.country;
        if (!prop) return null;

        if (typeof prop.raw === "string") return prop.raw;
        if (typeof prop.raw === "number") return prop.formatted ?? null;

        const raw = prop.raw as unknown;
        if (Array.isArray(raw) && raw.length > 0) return raw[0].name ?? null;

        return null;
    }

    private processPhoneInput(phone: string): void {
        // Remove existing country code if present
        let cleanPhone = phone.trim();
        
        // Check if phone starts with any known country code
        for (const country of CountryPhoneFormatter.COUNTRIES) {
            if (cleanPhone.startsWith(country.dialCode)) {
                cleanPhone = cleanPhone.substring(country.dialCode.length).trim();
                // Auto-select the matching country
                if (country.code !== this._selectedCountry.code) {
                    this._selectedCountry = country;
                    this.updateDisplay();
                }
                break;
            }
        }
        
        this.phoneInput.value = cleanPhone;
        this._phoneNumber = cleanPhone;
    }

    private updateDisplay(): void {
        // Update select
        this.countrySelect.value = this._selectedCountry.code;
        
        // Update prefix display
        this.prefixDisplay.textContent = this._selectedCountry.dialCode;
        
        // Update country info display
        const display = this._container.querySelector("#country-display") as HTMLDivElement;
        if (display) {
            display.innerHTML = `
                ${this._selectedCountry.flag} ${this._selectedCountry.name} (${this._selectedCountry.dialCode})
            `;
        }
    }

    private formatPhoneNumber(): void {
        let phone = this.phoneInput.value.trim();
        
        // Remove non-digits
        const digits = phone.replace(/\D/g, '');
        
        if (!digits) return;
        
        // Format based on country (example formatting for Jordan)
        if (this._selectedCountry.code === "jo" && digits.length === 9) {
            phone = digits.replace(/(\d{2})(\d{3})(\d{4})/, "$1 $2 $3");
        }
        // Add more country-specific formatting as needed
        
        this.phoneInput.value = phone;
        this._phoneNumber = phone;
        this.savePhoneNumber();
    }

    private getFullPhoneNumber(): string {
        const phoneDigits = this._phoneNumber.replace(/\D/g, '');
        return phoneDigits ? `${this._selectedCountry.dialCode} ${this._phoneNumber}`.trim() : "";
    }

    private savePhoneNumber(): void {
        this._notifyOutputChanged();
    }

    // OUTPUTS ---------------------------------------------------
    public getOutputs(): IOutputs {
        return {
            phone: this.getFullPhoneNumber()
        };
    }

    // STATE MANAGEMENT ---------------------------------------------------
    public getState(): ComponentFramework.Dictionary {
        return {
            selectedCountryCode: this._selectedCountry.code,
            phoneNumber: this._phoneNumber
        };
    }

    public destroy(): void {
        // Clean up event listeners if needed
    }
}