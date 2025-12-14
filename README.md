# 📞 Country Phone Formatter – PCF Control

A lightweight and professional **Power Apps Component Framework (PCF)** control that formats phone numbers with country support, built for **Model-Driven Apps**.

This control enhances phone number handling in Dataverse by ensuring consistent formatting, localization support, and modern UI behavior.

---

## ✨ Features

- 🎨 **Theme Support**
  - Light mode
  - Dark mode
  - Auto mode (follows system / app theme)

- 📱 **Phone Number Formatting**
  - Formats phone numbers based on country
  - Outputs a clean, standardized phone number

- 🧩 **Seamless Dataverse Integration**
  - Works with bound fields
  - Fully compatible with Model-Driven Apps

- ⚡ **Lightweight & Fast**
  - No external libraries
  - Clean TypeScript implementation

---

## 🧠 Use Cases

- CRM systems requiring standardized phone numbers
- Multilingual environments (Arabic / English)
- Organizations using dark/light themes
- Dataverse forms with international phone data

---

## 🛠️ Configuration

### Properties

| Property Name | Type | Description |
|--------------|------|-------------|
| `phone` | SingleLine.Text | Output formatted phone number |

> The control automatically formats and outputs the phone number based on the selected country.

---

## 🌐 Localization Details

- Language is detected using:
  ```ts
  context.userSettings.languageId
