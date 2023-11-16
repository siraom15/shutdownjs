# shutdownjs

A simple Node.js script to schedule system shutdowns.

![Demo](/images/1.png)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/siraom15/shutdownjs.git
   cd shutdownjs
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Make the script executable:

   ```bash
   chmod +x index.js
   ```

4. Link the script globally:

   ```bash
   npm link
   ```

## Usage

Now you can use the `shutdownjs` command globally. Run the following command to display the shutdown menu:

```bash
shutdownjs
```

Navigate through the menu using arrow keys, and press Enter to select an option. If you choose the "Enter custom time manually" option, you will be prompted to input the custom time.

To terminate the script, you can use Ctrl+C or Ctrl+Z.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
