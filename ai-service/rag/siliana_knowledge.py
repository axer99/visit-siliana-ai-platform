"""
Siliana Governorate Domain Knowledge Base
Structured historical, geographical, and practical knowledge used for RAG retrieval.
"""

SILIANA_KNOWLEDGE_DOCS = [
    {
        "id": "makthar-history",
        "title": "Site Archéologique de Makthar (Mactaris)",
        "region": "Makthar",
        "category": "heritage",
        "content": (
            "Makthar (antique Mactaris) est situé à 900 mètres d'altitude, à 35 km au sud-ouest de Siliana. "
            "Cité numide originelle devenue colonie romaine prospère, le site conserve des monuments majeurs : "
            "l'Arc de Trajan marquant l'entrée de la ville, les Grands Thermes du Sud avec de spectaculaires "
            "voûtes romaines et des sols en mosaïque, le Forum dallé, l'amphithéâtre taillé dans la colline, "
            "la Schola des Juvenes (école de la jeunesse numido-romaine) et le temple d'Hathor/Vénus. "
            "Le musée archéologique sur place abrite des stèles votives numides et des épigraphes néo-puniques uniques."
        )
    },
    {
        "id": "kesra-berber-village",
        "title": "Kesra — Le Plus Haut Village Berbère de Tunisie",
        "region": "Kesra",
        "category": "heritage",
        "content": (
            "Perché à plus de 1 000 mètres d'altitude sur une falaise calcaire, Kesra est considéré comme "
            "le plus haut village habité de Tunisie. Réputé pour son architecture troglodytique et en pierres sèches, "
            "ses ruelles en escaliers sculptées directement dans la roche mènent à des cascades et sources "
            "d'eau naturelles vauclusiennes (Aïn). Les vergers en terrasses produisent des figues de renommée nationale. "
            "Le Musée des Arts et Traditions Populaires de Kesra présente le patrimoine immatériel berbère, les tissages "
            "en laine de brebis et les méthodes traditionnelles de poterie modelée à la main."
        )
    },
    {
        "id": "djebel-bargou-nature",
        "title": "Djebel Bargou — Massif Montagneux, Randonnée et Spéléologie",
        "region": "Bargou",
        "category": "nature",
        "content": (
            "Le Djebel Bargou culmine à 1 260 mètres d'altitude et constitue une dorsale calcaire spectaculaire. "
            "C'est un spot privilégié pour le trekking de montagne, la traversée des crêtes et la spéléologie "
            "(grotte de la mine et gouffres naturels). La faune compte des aigles de Bonelli, des sangliers et "
            "des renards des collines, tandis que la flore abrite des pins d'Alep, des caroubiers et du thym sauvage. "
            "Sécurité : la spéléologie et l'escalade de falaise nécessitent un guide certifié et sont strictement "
            "déconseillées par temps de pluie en raison des risques de ruissellement et de parois glissantes."
        )
    },
    {
        "id": "zama-battlefield",
        "title": "La Plaine de Zama et la Fin de la Deuxième Guerre Punique",
        "region": "Siliana",
        "category": "heritage",
        "content": (
            "En 202 avant J.-C., les plaines antiques de la région de Siliana (identifiée historiquement sous le nom de Zama) "
            "furent le théâtre de la bataille décisive entre le général carthaginois Hannibal Barca et le général romain "
            "Scipion l'Africain avec l'appui de la cavalerie numide du roi Massinissa. La victoire romaine mit fin à "
            "la puissance carthaginoise et transforma la Numidie en un carrefour méditerranéen de premier plan. "
            "Aujourd'hui, le circuit de mémoire de Zama propose des sentiers panoramiques et des stèles d'interprétation."
        )
    },
    {
        "id": "siliana-gastronomy",
        "title": "Gastronomie du Terroir et Produits de la Montagne",
        "region": "Siliana",
        "category": "gastronomy",
        "content": (
            "Le terroir de Siliana est célèbre pour ses figues fraîches et séchées de Kesra, protégées par "
            "une Appellation d'Origine, son huile d'olive vierge extra issue des oliviers de montagne de Bargou, "
            "son miel de romarin et d'eucalyptus, ainsi que le couscous au blé dur traditionnel cuisiné avec du gibier "
            "ou des légumes de saison. Ne manquez pas de goûter au 'Mtabga' (galette farcie de montagne) cuite sur feu de bois."
        )
    },
    {
        "id": "practical-access-climate",
        "title": "Accès, Transport et Meilleures Périodes de Visite",
        "region": "Siliana",
        "category": "practical",
        "content": (
            "Accès : Siliana est située à 120 km au sud-ouest de Tunis (environ 1h45 en voiture via la Route Nationale 4). "
            "Des louages réguliers relient la station de Bab Alioua à Tunis vers Siliana, Makthar et Kesra. "
            "Climat : Le printemps (mars à mai) et l'automne (septembre à novembre) offrent les températures les plus douces "
            "(18°C à 24°C), idéales pour la marche et la découverte des sites. En hiver, les sommets de Bargou et Kesra peuvent "
            "connaître de brèves chutes de neige et des températures nocturnes proches de 2°C à 5°C."
        )
    }
]
