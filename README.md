# 📞 Country Phone Formatter  
### Power Apps Component Framework (PCF) Control

A **production-ready PCF control** designed for **Model-Driven Apps**, enabling clean, consistent, and localized phone number formatting with full theme awareness.

Built with performance, simplicity, and enterprise standards in mind.

---

## 🎥 Preview

> _Visual preview of the control in action_

![Light Mode](./assets/light-mode.png)
![Dark Mode](./assets/dark-mode.png)

> You can replace the images above with real screenshots or GIFs once available.

---

## ✨ Key Features

### 🎨 Smart Theme Awareness
- **Light Mode**
- **Dark Mode**
- **Auto Mode**  
  Automatically follows:
  - Power Apps theme
  - System preference
  - Browser settings

---

### 📱 Intelligent Phone Formatting
- Formats phone numbers based on country logic
- Outputs **clean & standardized values**
- Prevents inconsistent user input

---

### 🌐 Automatic Localization
- Detects system language using Dataverse settings
- Supports:
  - **English (LTR)**
  - **Arabic (RTL)**
- No configuration required

---

### 🧩 Native Dataverse Integration
- Works seamlessly with **bound fields**
- Fully compatible with **Model-Driven Apps**
- Uses official **PCF lifecycle & APIs**

---

### ⚡ Lightweight & Performant
- Zero external dependencies
- Clean, maintainable TypeScript
- Optimized for fast form rendering

---

## 🧠 Typical Use Cases

- 📇 CRM systems requiring standardized phone numbers
- 🌍 Multilingual environments (Arabic / English)
- 🌙 Organizations using Dark / Light themes
- ☎️ Dataverse forms with international phone data

---

## 🛠️ Configuration

### Control Properties

| Property Name | Type | Description |
|--------------|------|-------------|
| `phone` | SingleLine.Text | Outputs the formatted phone number |

> The control automatically processes and formats the phone number based on internal country logic.

---

## 🌐 Localization Behavior

Language is detected automatically using Dataverse user settings:

```ts
context.userSettings.languageId
