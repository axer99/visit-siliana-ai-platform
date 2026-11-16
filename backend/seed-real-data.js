const pool = require('./src/config/db');

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Seeding real authentic Siliana data...');

    // 1. Clean old test bookings and test entities
    await client.query('DELETE FROM bookings');
    await client.query("DELETE FROM activities WHERE title ILIKE '%test%'");
    await client.query("DELETE FROM events WHERE title ILIKE '%test%'");
    await client.query("DELETE FROM stays WHERE title ILIKE '%test%'");

    // 2. Real Siliana Activities with authentic photos
    const activitiesData = [
      {
        title: "Spéléologie à la Grotte de la Mine (Djebel Serj)",
        type: "caving",
        difficulty: "moderate",
        duration_hours: 4.5,
        price: 55,
        description: "Explorez l'une des plus spectaculaires cavités naturelles de Tunisie. Formations géologiques millénaires, stalactites calcaires et colonnes géantes encadrées par des moniteurs spéléo certifiés. Équipement complet fourni (casque, baudrier, frontale).",
        image_url: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Ascension du Pic de Djebel Bargou (1266m)",
        type: "hiking",
        difficulty: "hard",
        duration_hours: 6.0,
        price: 45,
        description: "Randonnée sportive vers le point culminant de la région. Traversée des forêts de chênes et de pins d'Alep avec panorama grandiose sur le bassin versant du barrage Siliana et les plaines historiques de Zama.",
        image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Parcours Patrimonial & Mégalithes de Kesra",
        type: "heritage walk",
        difficulty: "easy",
        duration_hours: 3.0,
        price: 25,
        description: "Visite guidée du village berbère le plus haut perché de Tunisie (1100m). Ruelles pavées d'époque byzantine, cascades naturelles des sources d'eau vive, pressoirs traditionnels et tombeaux mégalithiques.",
        image_url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Circuit Archéologique Guidé de Mactaris Antique (Makthar)",
        type: "heritage walk",
        difficulty: "easy",
        duration_hours: 3.5,
        price: 30,
        description: "Immersion dans la prestigieuse cité numido-romaine de Mactaris : les grands thermes du sud, l'arc triomphal de Trajan, le forum augustéen et le musée archéologique national.",
        image_url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Escalade des Falaises Calcaires de Bargou",
        type: "climbing",
        difficulty: "advanced",
        duration_hours: 4.0,
        price: 65,
        description: "Session d'escalade sportive sur parois rocheuses naturelles sécurisées (voies du 5b au 7c). Vue plongeante sur les oliveraies de Siliana avec cordage certifié UIAA et encadrement fédéral.",
        image_url: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Safari Éco-Photo au Parc National de Jebel Serj",
        type: "wildlife safari",
        difficulty: "easy",
        duration_hours: 5.0,
        price: 40,
        description: "Observation éco-responsable de la réserve faunique nationale réintroduisant la gazelle de montagne et le cerf de Berbérie. Découverte de la flore endémique (érable de Montpellier, chêne zéen).",
        image_url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Bivouac Étoilé & Astronomie au Col de Kesra",
        type: "camping",
        difficulty: "easy",
        duration_hours: 14.0,
        price: 80,
        description: "Nuitée en campement aménagé en altitude sans pollution lumineuse. Observation des constellations au télescope, feu de camp convivial, dîner du terroir et thé à la menthe sauvage.",
        image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Atelier Gastronomie & Récolte des Figues de Kesra",
        type: "gastronomy",
        difficulty: "easy",
        duration_hours: 2.5,
        price: 35,
        description: "Atelier culinaire authentique chez l'habitant : confection de la célèbre confiture de figues de Kesra, pressage d'huile d'olive de montagne et dégustation de pain Tabouna cuit au feu de bois.",
        image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
      }
    ];

    // Upsert or insert activities
    for (const a of activitiesData) {
      const existing = await client.query('SELECT id FROM activities WHERE title = $1', [a.title]);
      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO activities (title, type, difficulty, duration_hours, price, description, image_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [a.title, a.type, a.difficulty, a.duration_hours, a.price, a.description, a.image_url]
        );
      } else {
        await client.query(
          `UPDATE activities SET type=$1, difficulty=$2, duration_hours=$3, price=$4, description=$5, image_url=$6 WHERE id=$7`,
          [a.type, a.difficulty, a.duration_hours, a.price, a.description, a.image_url, existing.rows[0].id]
        );
      }
    }

    // 3. Real Siliana Stays (Gîtes, Chambres d'Hôtes, Eco-lodges)
    const staysData = [
      {
        title: "Dar Kesra — Maison d'Hôtes Panoramique",
        type: "traditional house",
        capacity: 6,
        price_per_night: 95,
        description: "Demeure traditionnelle en pierre sèche sculptée à flanc de falaise à 1100m d'altitude. Vue féérique sur la vallée, terrasse ombragée par des figuiers centenaires et petit-déjeuner bio inclus.",
        image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Éco-Lodge Serj & Bargou",
        type: "eco-lodge",
        capacity: 8,
        price_per_night: 130,
        description: "Chalet bioclimatique d'exception niché entre Djebel Serj et Bargou. Énergie 100% solaire, poêle à bois, verger d'arbres fruitiers et accès direct aux sentiers de trekking.",
        image_url: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Gîte Rural El Henchir (Gaâfour)",
        type: "guesthouse",
        capacity: 5,
        price_per_night: 75,
        description: "Authentique domaine agrotouristique entouré de 20 hectares d'oliviers et d'amandiers. Table d'hôte gourmande du terroir, calme absolu et randonnées à cheval.",
        image_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Auberge des Cascades de Kesra",
        type: "traditional house",
        capacity: 4,
        price_per_night: 65,
        description: "Refuge de charme à proximité immédiate des sources vives de Kesra. Accueil chaleureux par une famille locale, salon berbère traditionnel et tisanes aux herbes sauvages.",
        image_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Domaine Archéologique de Mactaris",
        type: "guesthouse",
        capacity: 6,
        price_per_night: 110,
        description: "Maison de caractère située à 5 minutes à pied du site numido-romain de Makthar. Décoration raffinée mêlant artisanat tunisien et confort moderne avec cheminée d'époque.",
        image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Campement Nomade Djebel Serj",
        type: "camping",
        capacity: 12,
        price_per_night: 45,
        description: "Tentes sahariennes confortables avec literie complète au pied de la réserve naturelle. Espace sanitaires écologiques, coin brasero et veillées aux contes traditionnels.",
        image_url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80"
      }
    ];

    for (const s of staysData) {
      const existing = await client.query('SELECT id FROM stays WHERE title = $1', [s.title]);
      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO stays (title, type, capacity, price_per_night, description, image_url)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [s.title, s.type, s.capacity, s.price_per_night, s.description, s.image_url]
        );
      } else {
        await client.query(
          `UPDATE stays SET type=$1, capacity=$2, price_per_night=$3, description=$4, image_url=$5 WHERE id=$6`,
          [s.type, s.capacity, s.price_per_night, s.description, s.image_url, existing.rows[0].id]
        );
      }
    }

    // 4. Real Siliana Cultural & Outdoor Events
    const eventsData = [
      {
        title: "Festival National des Figues de Kesra",
        description: "Grand rendez-vous annuel célébrant le patrimoine agricole et gastronomique du village perché de Kesra : foire artisanale, dégustations guidées, danses folkloriques et visites des vergers.",
        event_date: "2026-10-24",
        location: "Kesra Village Perché",
        image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Journées Archéologiques & Nuit des Flambeaux de Mactaris",
        description: "Visites théâtralisées nocturnes des thermes et de l'arc de Trajan éclairés aux flambeaux, suivies d'une conférence d'historiens sur la coexistence numido-romaine.",
        event_date: "2026-11-07",
        location: "Site Archéologique de Makthar",
        image_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Ultra Trail & Marathon des Crêtes de Bargou",
        description: "Compétition nationale d'éco-trail sur les crêtes rocheuses de Djebel Bargou réunissant plus de 350 athlètes et passionnés de montagne (parcours 18km et 36km).",
        event_date: "2026-11-21",
        location: "Djebel Bargou & Parc Serj",
        image_url: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Fête de la Récolte Oléicole & Huile Vierge de Siliana",
        description: "Ateliers de cueillette participative dans les oliveraies ancestrales de Gaâfour et pressage traditionnel à froid avec maîtres mouliniers.",
        event_date: "2026-12-05",
        location: "Plaine de Gaâfour & Bou Arada",
        image_url: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1000&q=80"
      }
    ];

    for (const e of eventsData) {
      const existing = await client.query('SELECT id FROM events WHERE title = $1', [e.title]);
      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO events (title, description, event_date, location, image_url)
           VALUES ($1, $2, $3, $4, $5)`,
          [e.title, e.description, e.event_date, e.location, e.image_url]
        );
      } else {
        await client.query(
          `UPDATE events SET description=$1, event_date=$2, location=$3, image_url=$4 WHERE id=$5`,
          [e.description, e.event_date, e.location, e.image_url, existing.rows[0].id]
        );
      }
    }

    // Refresh IDs
    const allActivities = (await client.query('SELECT id, price FROM activities ORDER BY id')).rows;
    const allStays = (await client.query('SELECT id, price_per_night FROM stays ORDER BY id')).rows;
    const allEvents = (await client.query('SELECT id FROM events ORDER BY id')).rows;

    console.log(`Available entities: ${allActivities.length} activities, ${allStays.length} stays, ${allEvents.length} events.`);

    // 5. Generate 40+ Rich, Realistic Bookings
    const visitors = [
      { name: "Yassine Ben Salem", email: "yassine.bensalem@gmail.com", phone: "+216 98 421 530" },
      { name: "Amira Trabelsi", email: "amira.trabelsi@yahoo.fr", phone: "+216 22 104 892" },
      { name: "Mehdi Mansour", email: "mehdi.mansour@topnet.tn", phone: "+216 55 330 918" },
      { name: "Sophie Dupont", email: "sophie.dupont@orange.fr", phone: "+33 6 12 34 56 78" },
      { name: "Karim Chaabane", email: "karim.chaabane@outlook.com", phone: "+216 29 881 204" },
      { name: "Syrine Khelifi", email: "syrine.khelifi@gmail.com", phone: "+216 94 662 109" },
      { name: "Lucas Bernard", email: "lucas.bernard@gmail.com", phone: "+33 7 89 01 23 45" },
      { name: "Fatma Dridi", email: "fatma.dridi@gnet.tn", phone: "+216 20 445 119" },
      { name: "Hedi Ben Ammar", email: "hedi.ammar@gmail.com", phone: "+216 50 112 400" },
      { name: "Nour Bouazizi", email: "nour.bouazizi@yahoo.com", phone: "+216 97 810 932" },
      { name: "Marco Rossi", email: "marco.rossi@virgilio.it", phone: "+39 340 1234567" },
      { name: "Ines Jaziri", email: "ines.jaziri@gmail.com", phone: "+216 24 559 881" },
      { name: "Bilel Guesmi", email: "bilel.guesmi@topnet.tn", phone: "+216 93 112 004" },
      { name: "Chloe Martin", email: "chloe.martin@free.fr", phone: "+33 6 45 78 12 90" },
      { name: "Mohamed Ali Riahi", email: "dali.riahi@gmail.com", phone: "+216 52 770 334" },
      { name: "Salma Rekik", email: "salma.rekik@gmail.com", phone: "+216 21 009 443" },
      { name: "Alexander Weber", email: "alex.weber@t-online.de", phone: "+49 171 2345678" },
      { name: "Rym Hamdi", email: "rym.hamdi@yahoo.fr", phone: "+216 99 334 521" },
      { name: "Tarek Meddeb", email: "tarek.meddeb@gmail.com", phone: "+216 26 890 114" },
      { name: "Leila Ayari", email: "leila.ayari@outlook.fr", phone: "+216 54 220 891" }
    ];

    const statuses = ['confirmed', 'confirmed', 'confirmed', 'pending', 'cancelled'];
    const now = new Date();

    const bookingsToInsert = [];

    // Past 60 days to next 30 days
    for (let i = 0; i < 42; i++) {
      const visitor = visitors[i % visitors.length];
      const isActivity = i % 3 === 0 || i % 3 === 1;
      const isStay = i % 3 === 2;
      const hasEvent = i % 7 === 0;

      let activityId = null;
      let stayId = null;
      let eventId = null;
      let unitPrice = 40;

      if (hasEvent && allEvents.length > 0) {
        eventId = allEvents[i % allEvents.length].id;
        unitPrice = 15;
      } else if (isStay && allStays.length > 0) {
        const s = allStays[i % allStays.length];
        stayId = s.id;
        unitPrice = Number(s.price_per_night) || 80;
      } else if (allActivities.length > 0) {
        const a = allActivities[i % allActivities.length];
        activityId = a.id;
        unitPrice = Number(a.price) || 45;
      }

      const peopleCount = (i % 4) + 1;
      const nights = isStay ? ((i % 3) + 1) : 1;
      const totalPrice = unitPrice * peopleCount * nights;

      // Date offset: between -60 days and +30 days
      const dayOffset = (i * 2.2) - 50;
      const bookingDate = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
      const createdAt = new Date(bookingDate.getTime() - (2 + (i % 5)) * 24 * 60 * 60 * 1000);
      
      const status = dayOffset < -25 ? 'confirmed' : statuses[i % statuses.length];

      bookingsToInsert.push({
        activity_id: activityId,
        stay_id: stayId,
        event_id: eventId,
        full_name: visitor.name,
        email: visitor.email,
        phone: visitor.phone,
        people_count: peopleCount,
        booking_date: bookingDate.toISOString().split('T')[0],
        total_price: totalPrice,
        status: status,
        created_at: createdAt.toISOString()
      });
    }

    for (const b of bookingsToInsert) {
      await client.query(
        `INSERT INTO bookings (activity_id, stay_id, event_id, full_name, email, phone, people_count, booking_date, total_price, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [b.activity_id, b.stay_id, b.event_id, b.full_name, b.email, b.phone, b.people_count, b.booking_date, b.total_price, b.status, b.created_at]
      );
    }

    await client.query('COMMIT');
    console.log(`Successfully seeded ${bookingsToInsert.length} bookings, updated activities and stays with high-res photos!`);

    const summary = await client.query(`
      SELECT 
        (SELECT count(*) FROM activities) as total_activities,
        (SELECT count(*) FROM stays) as total_stays,
        (SELECT count(*) FROM events) as total_events,
        (SELECT count(*) FROM bookings) as total_bookings,
        (SELECT sum(total_price) FROM bookings WHERE status='confirmed') as confirmed_revenue,
        (SELECT count(*) FROM bookings WHERE status='cancelled') as cancelled_bookings
    `);
    console.log('Database summary:', summary.rows[0]);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during seeding:', err);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
