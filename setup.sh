#!/bin/bash

# UniBridge Foundation Setup Script

echo "🌉 UniBridge Foundation Setup"
echo "================================"
echo ""

# Check if logo exists
if [ -f "public/logo.png" ]; then
    echo "✅ Logo file found!"
else
    echo "⚠️  Logo file not found!"
    echo ""
    echo "Please save your logo as 'logo.png' in the 'public/' folder."
    echo "The logo image you attached should be saved at: public/logo.png"
    echo ""
fi

echo ""
echo "🚀 To start the development server, run:"
echo "   npm run dev"
echo ""
echo "🔐 Admin login credentials:"
echo "   Username: admin"
echo "   Password: unibridge2025"
echo ""
echo "📝 For more information, see README.md"
echo ""
