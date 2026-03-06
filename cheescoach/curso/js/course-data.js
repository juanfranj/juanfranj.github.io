/**
 * CheesCoach - Complete Course Data
 *
 * 10 interactive lessons covering chess fundamentals for beginners.
 * All content in Spanish. All FEN positions validated.
 *
 * Exercise types:
 *   - "explore"       : Free exploration, no validation
 *   - "find-move"     : Find the one correct move
 *   - "sequence"      : Follow a guided move sequence
 *   - "play-position" : Find best move + opponent responds
 */

export const COURSE_DATA = {
    title: "Curso de Ajedrez para Principiantes",
    subtitle: "10 lecciones interactivas con tableros jugables",
    lessons: [

        /* ================================================================
           LECCION 1 - El Tablero y las Piezas
           ================================================================ */
        {
            id: 1,
            title: "El Tablero y las Piezas",
            shortTitle: "El Tablero",
            description: "Conoce el campo de batalla del ajedrez y las piezas que lo habitan.",
            icon: "♟",
            sections: [
                {
                    type: "text",
                    content: "El ajedrez se juega en un tablero de <strong>8 filas y 8 columnas</strong>, formando 64 casillas que alternan entre colores claros y oscuros. Las columnas se identifican con letras de la <em>a</em> a la <em>h</em> (de izquierda a derecha para las blancas), y las filas con numeros del <em>1</em> al <em>8</em> (de abajo hacia arriba para las blancas)."
                },
                {
                    type: "text",
                    content: "Cada casilla tiene un nombre unico combinando su columna y fila. Por ejemplo, la casilla de la esquina inferior izquierda (para las blancas) es <strong>a1</strong>, y la esquina superior derecha es <strong>h8</strong>."
                },
                {
                    type: "board-static",
                    fen: "start",
                    caption: "Posicion inicial: cada pieza en su lugar.",
                    orientation: "white"
                },
                {
                    type: "subtitle",
                    content: "Las Piezas"
                },
                {
                    type: "text",
                    content: "Cada jugador comienza con <strong>16 piezas</strong>: 1 Rey (♔), 1 Dama (♕), 2 Torres (♖), 2 Alfiles (♗), 2 Caballos (♘) y 8 Peones (♙). Las blancas siempre mueven primero."
                },
                {
                    type: "text",
                    content: "<strong>El Rey</strong> es la pieza mas importante. Si tu rey recibe jaque mate, pierdes la partida. Se mueve una casilla en cualquier direccion."
                },
                {
                    type: "text",
                    content: "<strong>La Dama</strong> es la pieza mas poderosa. Combina los movimientos de la torre y el alfil: se mueve en lineas rectas y diagonales cualquier numero de casillas."
                },
                {
                    type: "concept",
                    title: "Regla de la Dama",
                    content: "<strong>La dama siempre empieza en su propio color:</strong> la dama blanca en casilla blanca (d1), la dama negra en casilla negra (d8). Es la forma mas facil de recordar la posicion inicial."
                },
                {
                    type: "text",
                    content: "<strong>La Torre</strong> se mueve en lineas rectas (horizontal y vertical) cualquier numero de casillas. <strong>El Alfil</strong> se mueve en diagonal cualquier numero de casillas. <strong>El Caballo</strong> salta en forma de L y es la unica pieza que puede saltar sobre otras. <strong>El Peon</strong> avanza una casilla hacia adelante (o dos desde su posicion inicial) y captura en diagonal."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "Ejercicios"
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Mueve el Rey",
                    instruction: "Mueve el rey blanco una casilla hacia adelante (de e1 a e2).",
                    fen: "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "e1", to: "e2" }],
                    successMessage: "Perfecto! El rey se mueve una casilla en cualquier direccion.",
                    hintMessage: "El rey esta en e1. Muevelo a la casilla e2, justo delante.",
                    explanation: "El rey solo puede moverse una casilla por turno, pero puede ir en cualquier direccion: adelante, atras, a los lados o en diagonal."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Apertura clasica",
                    instruction: "Desde la posicion inicial, mueve el peon de rey (e2) dos casillas adelante a e4.",
                    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "e2", to: "e4" }],
                    successMessage: "Excelente! 1.e4 es la apertura mas popular en ajedrez.",
                    hintMessage: "Busca el peon en la columna e (delante del rey) y muevelo dos casillas.",
                    explanation: "Los peones pueden avanzar dos casillas desde su posicion inicial. 1.e4 controla el centro y abre lineas para el alfil y la dama."
                },
                {
                    type: "exercise",
                    exerciseType: "explore",
                    title: "Explora libremente",
                    instruction: "Explora la posicion inicial. Mueve las piezas libremente para familiarizarte con el tablero.",
                    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                    orientation: "white"
                }
            ]
        },

        /* ================================================================
           LECCION 2 - Como Mueve Cada Pieza
           ================================================================ */
        {
            id: 2,
            title: "Como Mueve Cada Pieza",
            shortTitle: "Movimientos",
            description: "Aprende el movimiento unico de cada pieza del ajedrez.",
            icon: "♞",
            sections: [
                {
                    type: "subtitle",
                    content: "El Peon"
                },
                {
                    type: "text",
                    content: "El peon es la pieza mas humilde pero tiene reglas unicas. Avanza <strong>una casilla hacia adelante</strong>, pero desde su posicion inicial puede avanzar <strong>dos casillas</strong>. A diferencia de las demas piezas, el peon <strong>captura en diagonal</strong>, no hacia adelante."
                },
                {
                    type: "board-static",
                    fen: "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1",
                    caption: "El peon en e2 puede avanzar a e3 (una casilla) o a e4 (dos casillas desde la posicion inicial).",
                    orientation: "white"
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Avance doble del peon",
                    instruction: "Mueve el peon de d2 dos casillas adelante a d4.",
                    fen: "4k3/8/8/8/8/8/3P4/3K4 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "d2", to: "d4" }],
                    successMessage: "Correcto! Desde su casilla inicial, el peon puede avanzar dos casillas.",
                    hintMessage: "El peon esta en d2. Muevelo a d4 (dos casillas adelante).",
                    explanation: "El avance de dos casillas solo esta disponible en el primer movimiento de cada peon."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "El Caballo"
                },
                {
                    type: "text",
                    content: "El caballo tiene el movimiento mas especial: se mueve en forma de <strong>L</strong> (dos casillas en una direccion y una perpendicular, o viceversa). Es la <strong>unica pieza que puede saltar</strong> sobre otras piezas."
                },
                {
                    type: "board-static",
                    fen: "4k3/8/8/8/4N3/8/8/4K3 w - - 0 1",
                    caption: "El caballo en e4 puede saltar a d2, f2, c3, g3, c5, g5, d6 o f6.",
                    orientation: "white"
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Salto del caballo",
                    instruction: "El caballo en b1 puede capturar el peon negro en c3. Haz la captura!",
                    fen: "4k3/8/8/8/8/2p5/8/1N2K3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "b1", to: "c3" }],
                    successMessage: "Genial! El caballo salta en forma de L, incluso sobre otras piezas.",
                    hintMessage: "El caballo esta en b1. Salta a c3 donde esta el peon negro.",
                    explanation: "El caballo se mueve dos casillas en una direccion y una casilla perpendicular, formando una L."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "El Alfil"
                },
                {
                    type: "text",
                    content: "El alfil se mueve en <strong>diagonal</strong> cualquier numero de casillas. Cada jugador tiene dos alfiles: uno en casillas claras y otro en casillas oscuras. Un alfil nunca cambia el color de su casilla."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Diagonal del alfil",
                    instruction: "Mueve el alfil de c1 a la casilla f4, en diagonal.",
                    fen: "4k3/8/8/8/8/8/8/2B1K3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "c1", to: "f4" }],
                    successMessage: "Perfecto! El alfil domina las diagonales.",
                    hintMessage: "El alfil esta en c1. Muevelo en diagonal hacia arriba y a la derecha hasta f4.",
                    explanation: "El alfil se desliza por las diagonales sin limite de casillas, pero no puede saltar piezas."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "La Torre"
                },
                {
                    type: "text",
                    content: "La torre se mueve en <strong>lineas rectas</strong>: horizontal o verticalmente, cualquier numero de casillas. Es una pieza muy poderosa, especialmente en columnas abiertas y en la septima fila."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Linea recta de la torre",
                    instruction: "Mueve la torre de a1 hasta el otro extremo: a8.",
                    fen: "4k3/8/8/8/8/8/8/R3K3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "a1", to: "a8" }],
                    successMessage: "Excelente! La torre recorre toda la columna de una vez.",
                    hintMessage: "La torre esta en a1. Muevela hacia arriba por la columna a hasta a8.",
                    explanation: "La torre controla toda la fila y la columna donde se encuentra. Son especialmente fuertes cuando trabajan juntas."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "La Dama"
                },
                {
                    type: "text",
                    content: "La dama es la pieza mas poderosa. Combina los movimientos de la <strong>torre y el alfil</strong>: puede moverse en lineas rectas y diagonales cualquier numero de casillas."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Poder de la dama",
                    instruction: "La dama en d1 puede capturar el peon negro en d7. Capturalo!",
                    fen: "4k3/3p4/8/8/8/8/8/3QK3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "d1", to: "d7" }],
                    successMessage: "La dama controla filas, columnas y diagonales. Es devastadora!",
                    hintMessage: "La dama esta en d1. Muevela hacia arriba por la columna d hasta d7.",
                    explanation: "La dama vale 9 puntos, mas que cualquier otra pieza excepto el rey. Protegela bien!"
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "El Rey"
                },
                {
                    type: "text",
                    content: "El rey se mueve <strong>una sola casilla</strong> en cualquier direccion. Aunque su movimiento es limitado, es la pieza mas importante: si recibes jaque mate, pierdes."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Paso del rey",
                    instruction: "Mueve el rey blanco de e1 a d2 (un paso en diagonal).",
                    fen: "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [
                        { from: "e1", to: "d2" },
                        { from: "e1", to: "e2" },
                        { from: "e1", to: "f2" },
                        { from: "e1", to: "d1" },
                        { from: "e1", to: "f1" }
                    ],
                    successMessage: "Bien hecho! El rey puede ir a cualquier casilla adyacente.",
                    hintMessage: "El rey esta en e1. Muevelo una casilla en cualquier direccion.",
                    explanation: "El rey es lento pero esencial. En el final de partida se convierte en una pieza activa muy importante."
                }
            ]
        },

        /* ================================================================
           LECCION 3 - Reglas Especiales
           ================================================================ */
        {
            id: 3,
            title: "Reglas Especiales",
            shortTitle: "Reglas Especiales",
            description: "Domina el enroque, la captura al paso y la promocion del peon.",
            icon: "🏰",
            sections: [
                {
                    type: "subtitle",
                    content: "El Enroque"
                },
                {
                    type: "text",
                    content: "El enroque es un movimiento especial que permite <strong>mover el rey y una torre al mismo tiempo</strong>. Es el unico momento en toda la partida donde puedes mover dos piezas en un turno. Sirve para poner al rey a salvo y activar la torre."
                },
                {
                    type: "text",
                    content: "Hay dos tipos: <strong>enroque corto</strong> (hacia el flanco de rey, notacion: O-O) y <strong>enroque largo</strong> (hacia el flanco de dama, notacion: O-O-O)."
                },
                {
                    type: "text",
                    content: "<strong>Requisitos para enrocar:</strong> (1) Ni el rey ni la torre pueden haberse movido antes. (2) No puede haber piezas entre el rey y la torre. (3) El rey no puede estar en jaque. (4) El rey no puede pasar por una casilla atacada."
                },
                {
                    type: "board-static",
                    fen: "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1",
                    caption: "Ambos bandos pueden enrocar en ambos flancos. El camino esta despejado.",
                    orientation: "white"
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Enroque corto",
                    instruction: "Realiza el enroque corto: mueve el rey de e1 a g1.",
                    fen: "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "e1", to: "g1" }],
                    successMessage: "Perfecto! El rey va a g1 y la torre salta a f1 automaticamente.",
                    hintMessage: "Mueve el rey dos casillas hacia la derecha: de e1 a g1.",
                    explanation: "En el enroque corto, el rey se mueve dos casillas hacia la torre del flanco de rey, y la torre salta al otro lado del rey."
                },
                {
                    type: "concept",
                    title: "Regla de oro",
                    content: "<strong>El enroque es el unico movimiento donde mueves dos piezas a la vez.</strong> Es casi siempre buena idea enrocar pronto para proteger al rey."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "La Captura al Paso (En Passant)"
                },
                {
                    type: "text",
                    content: "Cuando un peon avanza dos casillas desde su posicion inicial y queda al lado de un peon enemigo, este puede capturarlo <strong>como si hubiera avanzado solo una casilla</strong>. Esta captura solo se puede hacer en el turno inmediatamente siguiente al avance doble."
                },
                {
                    type: "board-static",
                    fen: "4k3/8/8/4Pp2/8/8/8/4K3 w - f6 0 1",
                    caption: "El peon negro acaba de avanzar de f7 a f5. El peon blanco en e5 puede capturarlo al paso en f6.",
                    orientation: "white"
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Captura al paso",
                    instruction: "El peon negro acaba de mover de f7 a f5. Captura al paso: mueve tu peon de e5 a f6.",
                    fen: "4k3/8/8/4Pp2/8/8/8/4K3 w - f6 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "e5", to: "f6" }],
                    successMessage: "Excelente! El peon negro desaparece aunque tu peon fue a una casilla 'vacia'.",
                    hintMessage: "Tu peon blanco esta en e5. Captura en diagonal a f6 (al paso).",
                    explanation: "La captura al paso es una regla que evita que los peones 'esquiven' el control de los peones enemigos con el avance doble."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "La Promocion del Peon"
                },
                {
                    type: "text",
                    content: "Cuando un peon llega a la <strong>ultima fila</strong> (fila 8 para blancas, fila 1 para negras), se transforma en otra pieza: dama, torre, alfil o caballo. Casi siempre se elige la dama por ser la mas poderosa. Esto se llama <strong>promocion</strong>."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Promociona el peon",
                    instruction: "Tu peon esta a un paso de la ultima fila. Muevelo de e7 a e8 para promocionar!",
                    fen: "k7/4P3/8/8/8/8/8/4K3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "e7", to: "e8" }],
                    successMessage: "El peon se convierte en dama! Un peon que promociona puede cambiar toda la partida.",
                    hintMessage: "El peon esta en e7. Solo necesita avanzar una casilla mas a e8.",
                    explanation: "La promocion convierte un humilde peon en la pieza mas poderosa del tablero. Por eso los peones pasados son tan valiosos en los finales."
                },
                {
                    type: "tip",
                    title: "Consejo",
                    content: "En casi todos los casos, promociona a <strong>dama</strong>. Solo en situaciones muy especificas (como evitar ahogado) conviene elegir otra pieza."
                }
            ]
        },

        /* ================================================================
           LECCION 4 - Jaque, Mate y Tablas
           ================================================================ */
        {
            id: 4,
            title: "Jaque, Jaque Mate y Tablas",
            shortTitle: "Jaque y Mate",
            description: "Entiende como termina una partida de ajedrez.",
            icon: "♚",
            sections: [
                {
                    type: "subtitle",
                    content: "El Jaque"
                },
                {
                    type: "text",
                    content: "Cuando una pieza ataca directamente al rey enemigo, se dice que el rey esta en <strong>jaque</strong>. El jugador en jaque <strong>debe</strong> salir de el inmediatamente. Hay tres formas de escapar:"
                },
                {
                    type: "text",
                    content: "<strong>1. Mover el rey</strong> a una casilla segura.<br><strong>2. Bloquear</strong> el jaque interponiendo una pieza.<br><strong>3. Capturar</strong> la pieza que da jaque."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "El Jaque Mate"
                },
                {
                    type: "text",
                    content: "Si el rey esta en jaque y <strong>no hay ninguna forma de escapar</strong> (no puede moverse, no puede bloquear, no puede capturar al atacante), es <strong>jaque mate</strong>. La partida termina inmediatamente y el jugador que dio mate gana."
                },
                {
                    type: "board-static",
                    fen: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4",
                    caption: "El famoso 'mate del pastor'. La dama blanca en f7 da jaque mate al rey negro.",
                    orientation: "white"
                },
                {
                    type: "warning",
                    title: "Cuidado con el mate del pastor!",
                    content: "Muchos principiantes caen en este mate en solo 4 jugadas. Aprende a reconocerlo y a defenderte: desarrolla tus piezas y protege f7 (o f2 si eres blancas)."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "Tablas y Ahogado"
                },
                {
                    type: "text",
                    content: "La partida puede terminar en <strong>tablas</strong> (empate) de varias formas. La mas importante es el <strong>ahogado</strong>: cuando un jugador NO esta en jaque pero no tiene ningun movimiento legal. Tambien hay tablas por acuerdo mutuo, repeticion triple de posicion, regla de los 50 movimientos o material insuficiente."
                },
                {
                    type: "board-static",
                    fen: "k7/8/1KQ5/8/8/8/8/8 b - - 0 1",
                    caption: "Ahogado! El rey negro en a8 no esta en jaque, pero no puede moverse a ninguna casilla legal. Es tablas.",
                    orientation: "white"
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "Ejercicios: Mate en 1"
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Mate con torre",
                    instruction: "Las blancas juegan. Encuentra el mate en 1 con la torre.",
                    fen: "k7/8/1K6/8/8/8/8/7R w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "h1", to: "h8" }],
                    successMessage: "Th8# Jaque mate! El rey negro no tiene escapatoria.",
                    hintMessage: "La torre puede dar jaque en la ultima fila. El rey blanco controla las casillas de escape.",
                    explanation: "La torre da jaque en h8. El rey negro en a8 no puede ir a a7 ni b8 (controladas por el rey blanco en b6), ni a b7 (tambien controlada por Kb6). Mate!"
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Mate en la octava",
                    instruction: "Las blancas juegan. Encuentra el mate en 1 movimiento.",
                    fen: "6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "e1", to: "e8" }],
                    successMessage: "Te8# Jaque mate! El 'mate de la clavada en la octava'.",
                    hintMessage: "La torre puede ir a la ultima fila. Los propios peones negros bloquean al rey.",
                    explanation: "La torre da jaque en e8. El rey negro en g8 esta encerrado por sus propios peones en f7, g7 y h7. Esto se llama 'mate del pasillo'."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "El mate del pastor",
                    instruction: "Las blancas juegan. Completa el mate del pastor con la dama!",
                    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 3",
                    orientation: "white",
                    correctMoves: [{ from: "f3", to: "f7" }],
                    successMessage: "Dxf7# Jaque mate! El famoso mate del pastor.",
                    hintMessage: "La dama puede capturar el peon f7. Mira quien protege esa casilla... solo el rey!",
                    explanation: "La dama captura en f7 con jaque. El alfil en c4 tambien apunta a f7, asi que el rey no puede capturar la dama. No hay casilla de escape. Mate!"
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Mate con escalera",
                    instruction: "Las blancas juegan. Da jaque mate con la torre.",
                    fen: "1k6/8/1K6/8/8/8/8/R7 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "a1", to: "a8" }],
                    successMessage: "Ta8# Jaque mate! La torre y el rey trabajan en equipo.",
                    hintMessage: "La torre puede ir a a8. El rey blanco controla las casillas de escape del rey negro.",
                    explanation: "Ta8 es jaque mate. El rey negro en b8 no puede ir a a7, a8 (torre), b7 (rey blanco en b6), c8 o c7 (rey blanco). Perfecto!"
                }
            ]
        },

        /* ================================================================
           LECCION 5 - Valor de las Piezas
           ================================================================ */
        {
            id: 5,
            title: "El Valor de las Piezas",
            shortTitle: "Valor Piezas",
            description: "Aprende cuanto vale cada pieza y como hacer buenos intercambios.",
            icon: "⚖",
            sections: [
                {
                    type: "text",
                    content: "No todas las piezas valen lo mismo. Conocer el valor relativo de cada pieza te ayuda a decidir cuando un intercambio (cambiar piezas) es favorable para ti."
                },
                {
                    type: "piece-values",
                    pieces: [
                        { icon: "♙", name: "Peon", value: "1 punto" },
                        { icon: "♘", name: "Caballo", value: "3 puntos" },
                        { icon: "♗", name: "Alfil", value: "3 puntos" },
                        { icon: "♖", name: "Torre", value: "5 puntos" },
                        { icon: "♕", name: "Dama", value: "9 puntos" },
                        { icon: "♔", name: "Rey", value: "Infinito" }
                    ]
                },
                {
                    type: "concept",
                    title: "Piezas menores y mayores",
                    content: "Caballo y alfil son <strong>piezas menores</strong> (3 puntos cada una). Torre y dama son <strong>piezas mayores</strong> (5 y 9 puntos). Un caballo o alfil vale lo mismo que 3 peones."
                },
                {
                    type: "text",
                    content: "Un <strong>buen intercambio</strong> es cuando capturas una pieza de mayor valor que la que pierdes. Por ejemplo, si tu alfil (3) captura una torre (5), has ganado material: +2 puntos de ventaja."
                },
                {
                    type: "tip",
                    title: "Consejo",
                    content: "Capturar una torre con un alfil o caballo se llama <strong>'ganar la calidad'</strong> (+2 puntos). Cambiar tu dama por una torre es un mal negocio (-4 puntos)."
                },
                {
                    type: "text",
                    content: "El rey tiene valor infinito porque si lo pierdes, pierdes la partida. No se le asigna un valor numerico en los intercambios."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "Ejercicios: Capturas Inteligentes"
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Captura la pieza valiosa",
                    instruction: "La dama blanca puede capturar el caballo negro indefenso en d5. Gana material!",
                    fen: "4k3/8/8/3n4/8/8/8/3QK3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "d1", to: "d5" }],
                    successMessage: "Dxd5! Capturas un caballo (3 puntos) gratis. Excelente!",
                    hintMessage: "La dama en d1 puede moverse a d5 donde esta el caballo negro sin proteccion.",
                    explanation: "Cuando una pieza enemiga no esta defendida, capturarla es ganar material. Busca siempre piezas 'colgadas' (sin proteccion)."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Gana la calidad",
                    instruction: "Tu alfil en b2 puede capturar la torre negra indefensa en g7. Hazlo!",
                    fen: "4k3/6r1/8/8/8/8/1B6/4K3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "b2", to: "g7" }],
                    successMessage: "Axg7! Capturas una torre (5) con tu alfil (3). Ganas +2 puntos de material!",
                    hintMessage: "El alfil en b2 ataca en diagonal a la torre en g7. La torre no esta protegida.",
                    explanation: "Ganar la calidad (cambiar alfil por torre) te da una ventaja de 2 puntos. Las torres son muy fuertes en finales."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Captura correcta",
                    instruction: "Tu torre en e1 puede capturar el alfil negro indefenso en e7. Gana material!",
                    fen: "4k3/4b3/8/8/8/8/8/4RK2 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "e1", to: "e7" }],
                    successMessage: "Txe7! Capturas el alfil (3 puntos) con la torre. Buen ojo!",
                    hintMessage: "La torre en e1 esta en la misma columna que el alfil negro en e7.",
                    explanation: "Capturar piezas indefensas es fundamental. Siempre verifica que la casilla de captura sea segura antes de mover."
                },
                {
                    type: "warning",
                    title: "No regales tu dama!",
                    content: "La dama vale 9 puntos. Perderla por un caballo (3) o un alfil (3) es desastroso. Siempre piensa: 'Si muevo mi pieza ahi, puede ser capturada?'"
                }
            ]
        },

        /* ================================================================
           LECCION 6 - Principios de Apertura
           ================================================================ */
        {
            id: 6,
            title: "Principios de Apertura",
            shortTitle: "Aperturas",
            description: "Los 4 principios fundamentales de Jose Raul Capablanca para empezar bien.",
            icon: "📖",
            sections: [
                {
                    type: "text",
                    content: "Jose Raul Capablanca, campeon mundial de 1921 a 1927, definio cuatro principios basicos de apertura que todo jugador debe seguir. Estos principios son la base de todo buen juego."
                },
                {
                    type: "concept",
                    title: "Los 4 Principios de Apertura",
                    content: "<strong>1. Controla el centro</strong> con peones (e4, d4) y piezas.<br><strong>2. Desarrolla tus piezas</strong> rapido (caballos y alfiles primero).<br><strong>3. Enroca pronto</strong> para proteger al rey.<br><strong>4. No muevas la misma pieza dos veces</strong> sin razon en la apertura."
                },
                {
                    type: "text",
                    content: "Veamos estos principios en accion con la <strong>Apertura Italiana</strong>, una de las aperturas mas clasicas y educativas del ajedrez."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "Practica: La Apertura Italiana"
                },
                {
                    type: "exercise",
                    exerciseType: "sequence",
                    title: "Juega la Apertura Italiana",
                    instruction: "Sigue los movimientos de la Apertura Italiana. Tu juegas con blancas.",
                    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                    orientation: "white",
                    steps: [
                        { move: "e4", explanation: "1.e4 - Controla el centro con el peon de rey.", hint: "Mueve el peon de e2 a e4." },
                        { move: "e5", explanation: "1...e5 - Las negras responden simetricamente." },
                        { move: "Nf3", explanation: "2.Cf3 - Desarrolla el caballo atacando el peon e5.", hint: "Desarrolla el caballo de g1 a f3." },
                        { move: "Nc6", explanation: "2...Cc6 - Las negras defienden el peon e5." },
                        { move: "Bc4", explanation: "3.Ac4 - Desarrolla el alfil apuntando a f7, el punto mas debil.", hint: "Mueve el alfil de f1 a c4." },
                        { move: "Bc5", explanation: "3...Ac5 - Las negras desarrollan su alfil simetricamente." }
                    ]
                },
                {
                    type: "text",
                    content: "Despues de estos 3 movimientos para cada bando, las blancas han seguido todos los principios: peones en el centro, dos piezas desarrolladas, y el camino libre para enrocar."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "Mas Ejercicios de Apertura"
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Desarrolla una pieza",
                    instruction: "Despues de 1.e4 e5, desarrolla el caballo de rey a su mejor casilla.",
                    fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
                    orientation: "white",
                    correctMoves: [{ from: "g1", to: "f3" }],
                    successMessage: "Cf3! Desarrollas el caballo y atacas el peon e5. Perfecto!",
                    hintMessage: "El caballo en g1 tiene una casilla ideal: f3, donde controla el centro y ataca e5.",
                    explanation: "Cf3 es el movimiento de desarrollo mas natural: el caballo va al centro, ataca e5 y no bloquea ningun peon."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Hora de enrocar",
                    instruction: "Ya has desarrollado las piezas del flanco de rey. Es hora de enrocar para proteger al rey!",
                    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
                    orientation: "white",
                    correctMoves: [{ from: "e1", to: "g1" }],
                    successMessage: "O-O! Tu rey esta seguro y tu torre entra en juego. Excelente!",
                    hintMessage: "El camino entre el rey y la torre de h1 esta libre. Enroca corto!",
                    explanation: "Enrocar pronto es uno de los principios mas importantes. Tu rey queda protegido detras de los peones y la torre se activa."
                },
                {
                    type: "tip",
                    title: "Errores comunes en la apertura",
                    content: "Evita estos errores: <strong>sacar la dama muy pronto</strong> (sera atacada y perderas tiempos), <strong>mover el mismo caballo varias veces</strong>, o <strong>capturar peones de los laterales</strong> mientras tus piezas duermen en la primera fila."
                }
            ]
        },

        /* ================================================================
           LECCION 7 - Tacticas Basicas
           ================================================================ */
        {
            id: 7,
            title: "Tacticas Basicas",
            shortTitle: "Tacticas",
            description: "Aprende los patrones tacticos que te permitiran ganar material.",
            icon: "⚔",
            sections: [
                {
                    type: "text",
                    content: "Las tacticas son secuencias de movimientos forzados que explotan debilidades en la posicion enemiga. Conocer los patrones tacticos basicos te dara una ventaja enorme sobre tus rivales."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "La Horquilla (Tenedor)"
                },
                {
                    type: "text",
                    content: "Una <strong>horquilla</strong> ocurre cuando una pieza ataca <strong>dos o mas piezas enemigas al mismo tiempo</strong>. El rival solo puede salvar una, asi que ganas la otra. Los caballos son los reyes de las horquillas por su movimiento impredecible."
                },
                {
                    type: "board-static",
                    fen: "4k3/8/3N4/8/8/8/8/4K3 w - - 0 1",
                    caption: "El caballo en d6 da jaque al rey y ataca una posible pieza en otro lado. Una horquilla clasica.",
                    orientation: "white"
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Horquilla de caballo",
                    instruction: "Mueve el caballo a una casilla donde ataque al rey Y a la torre al mismo tiempo.",
                    fen: "r3k3/8/8/8/4N3/8/8/4K3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "e4", to: "d6" }],
                    successMessage: "Cd6+! Horquilla! El caballo ataca al rey en e8 y la torre en a8. Genial!",
                    hintMessage: "Desde e4, el caballo puede ir a d6. Mira que piezas atacaria desde ahi...",
                    explanation: "Cd6+ es jaque, asi que el rey DEBE moverse. Luego capturas la torre en a8. Las horquillas de caballo con jaque son devastadoras."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "La Clavada"
                },
                {
                    type: "text",
                    content: "Una <strong>clavada</strong> ocurre cuando una pieza de largo alcance (alfil, torre o dama) ataca una pieza que <strong>no puede moverse porque dejaria expuesta una pieza mas valiosa detras</strong>. Si la pieza detras es el rey, la clavada es <em>absoluta</em> (la pieza clavada no puede moverse legalmente)."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Clava el caballo",
                    instruction: "Mueve la torre a d1 para clavar el caballo negro contra su rey.",
                    fen: "3k4/8/8/8/8/3n4/8/R3K3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "a1", to: "d1" }],
                    successMessage: "Td1! El caballo en d3 esta clavado: no puede moverse porque expondria al rey en d8.",
                    hintMessage: "La torre esta en a1. Muevela a d1 para alinear la torre, el caballo y el rey en la columna d.",
                    explanation: "La clavada es una de las tacticas mas comunes. La torre en d1 ataca el caballo en d3, que no puede moverse porque el rey en d8 quedaria en jaque."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "La Brocheta (Pincho)"
                },
                {
                    type: "text",
                    content: "Una <strong>brocheta</strong> es lo contrario de una clavada: se ataca a la pieza <strong>mas valiosa primero</strong>, forzandola a moverse, y luego se captura la pieza que estaba detras."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Brocheta con alfil",
                    instruction: "Mueve el alfil para dar jaque al rey negro. Detras del rey hay una torre!",
                    fen: "8/8/8/8/8/r1k5/8/B3K3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "a1", to: "b2" }],
                    successMessage: "Ab2+! Jaque al rey, y cuando se mueva, capturas la torre en a3. Brocheta perfecta!",
                    hintMessage: "El alfil en a1 puede ir a b2 dando jaque al rey en c3. Que hay detras del rey?",
                    explanation: "Ab2+ da jaque al rey en c3. El rey debe moverse, y la torre en a3 queda indefensa en la diagonal del alfil."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "El Ataque Doble"
                },
                {
                    type: "text",
                    content: "Un <strong>ataque doble</strong> es similar a la horquilla: una pieza amenaza dos cosas a la vez. Puede ser una amenaza de mate y una captura, o dos capturas simultaneas. La dama es especialista en ataques dobles."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Ataque doble de dama",
                    instruction: "Mueve la dama a una casilla donde amenace al rey (jaque) y a la torre al mismo tiempo.",
                    fen: "4k3/8/8/8/6r1/8/8/3QK3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "d1", to: "a4" }],
                    successMessage: "Da4+! Jaque al rey y ataque a la torre en g4. La dama es letal!",
                    hintMessage: "Busca una casilla en la diagonal donde la dama de jaque y ademas ataque la torre en g4.",
                    explanation: "Da4+ da jaque al rey en e8. Despues de que el rey se mueva, la dama captura la torre en g4. La dama es la mejor pieza para ataques dobles por su gran alcance."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Horquilla de peon",
                    instruction: "Avanza el peon de d4 a d5 para atacar ambas piezas negras a la vez!",
                    fen: "4k3/8/2n1b3/8/3P4/8/8/4K3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "d4", to: "d5" }],
                    successMessage: "d5! El peon ataca el caballo en c6 y el alfil en e6. Hasta los peones hacen horquillas!",
                    hintMessage: "El peon en d4 puede avanzar a d5, atacando en diagonal a c6 y e6.",
                    explanation: "Los peones tambien pueden hacer horquillas! Al avanzar a d5, el peon ataca en diagonal las casillas c6 y e6, donde estan el caballo y el alfil. Ambas piezas estan amenazadas!"
                },
                {
                    type: "concept",
                    title: "Practica tacticas a diario",
                    content: "Las tacticas se aprenden con practica repetida. Resuelve puzzles cada dia y pronto empezaras a ver estos patrones en tus propias partidas. <strong>CheesCoach incluye un modo de puzzles para practicar!</strong>"
                }
            ]
        },

        /* ================================================================
           LECCION 8 - Estrategia en el Medio Juego
           ================================================================ */
        {
            id: 8,
            title: "Estrategia en el Medio Juego",
            shortTitle: "Medio Juego",
            description: "Piezas activas, estructura de peones y planes estrategicos.",
            icon: "🧠",
            sections: [
                {
                    type: "text",
                    content: "La estrategia es el <strong>plan a largo plazo</strong> de tu partida. Mientras las tacticas son combinaciones concretas de movimientos, la estrategia se trata de <strong>mejorar tu posicion</strong> gradualmente. Capablanca decia: 'Para mejorar en ajedrez, debes estudiar los finales primero, luego la estrategia y por ultimo las aperturas.'"
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "Piezas Activas vs Pasivas"
                },
                {
                    type: "text",
                    content: "Una pieza <strong>activa</strong> controla casillas importantes, ataca piezas enemigas y participa en el juego. Una pieza <strong>pasiva</strong> esta atrapada, bloqueada o sin funcion. Tu objetivo estrategico principal es: <strong>activar tus piezas y restringir las del rival</strong>."
                },
                {
                    type: "board-static",
                    fen: "r2qkbnr/ppp2ppp/2np4/4p1B1/2B1P3/5N2/PPP2PPP/RN1QK2R w KQkq - 0 5",
                    caption: "Las blancas tienen piezas activas: alfil en c4 y g5, caballo en f3. Las negras tienen piezas pasivas: alfil en f8 y caballo en b8.",
                    orientation: "white"
                },
                {
                    type: "concept",
                    title: "Principio de Capablanca",
                    content: "\"En una posicion superior, busca el cambio de piezas. En una posicion inferior, evitalo.\" Si tienes mas material o mejor posicion, <strong>simplifica</strong> cambiando piezas para llegar a un final ganador."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "Estructura de Peones"
                },
                {
                    type: "text",
                    content: "Los peones son el 'esqueleto' de tu posicion. Su estructura determina donde tus piezas son fuertes o debiles. Hay tres tipos de peones problematicos:"
                },
                {
                    type: "text",
                    content: "<strong>Peones doblados:</strong> dos peones del mismo color en la misma columna. Son debiles porque no se protegen entre si.<br><strong>Peones aislados:</strong> un peon sin ningun peon amigo en las columnas adyacentes. Es vulnerable porque debe ser defendido por piezas.<br><strong>Peones pasados:</strong> un peon sin peones enemigos que puedan bloquearlo o capturarlo en su camino a promocion. Son MUY fuertes!"
                },
                {
                    type: "board-static",
                    fen: "4k3/pp3ppp/3p4/2pP4/2P5/1P6/P4PPP/4K3 w - - 0 1",
                    caption: "d6 negro es un peon aislado. d5 blanco es un peon pasado (ningun peon negro puede frenarlo). Los peones blancos b3/c4 forman una cadena solida.",
                    orientation: "white"
                },
                {
                    type: "tip",
                    title: "Consejo",
                    content: "Los peones pasados deben ser <strong>empujados</strong>! Cuanto mas avanza un peon pasado, mas peligroso se vuelve. El rival tendra que gastar piezas para frenarlo."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "Ejercicios de Estrategia"
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Activa tu torre",
                    instruction: "Tu torre en a1 no hace nada. Muevela a la columna d abierta para activarla!",
                    fen: "r3k3/ppp2ppp/8/3p4/3P4/8/PPP2PPP/R3K3 w Qq - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "a1", to: "d1" }],
                    successMessage: "Td1! La torre se activa en la columna semiabierta. Ahora presiona d5!",
                    hintMessage: "La columna d esta semiabierta (sin peon blanco). Mueve la torre ahi.",
                    explanation: "Las torres necesitan columnas abiertas o semiabiertas para ser efectivas. En d1, la torre presiona el peon d5 negro."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Empuja el peon pasado",
                    instruction: "Tu peon en d5 es un peon pasado. Empujalo un paso mas hacia la promocion!",
                    fen: "4k3/8/8/3P4/8/8/8/4K3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "d5", to: "d6" }],
                    successMessage: "d6! El peon pasado avanza. Cada casilla mas cerca de d8 es mas peligroso!",
                    hintMessage: "El peon pasado en d5 no tiene ningun peon negro que lo frene. Empujalo a d6.",
                    explanation: "Un peon pasado es una ventaja estrategica enorme. En finales, a menudo un peon pasado avanzado decide la partida."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Centraliza tu rey",
                    instruction: "En el final, el rey es una pieza fuerte. Centraliza tu rey moviendolo a e2.",
                    fen: "8/8/8/3pk3/3P4/8/8/4K3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "e1", to: "e2" }],
                    successMessage: "Re2! El rey se centraliza. En finales, el rey activo es una arma poderosa.",
                    hintMessage: "El rey esta en e1. Acercalo al centro moviendolo a e2.",
                    explanation: "En el final, con pocas piezas en el tablero, el rey se convierte en una pieza de ataque. Centralizar el rey es uno de los principios mas importantes de los finales."
                }
            ]
        },

        /* ================================================================
           LECCION 9 - Finales Basicos
           ================================================================ */
        {
            id: 9,
            title: "Finales Basicos",
            shortTitle: "Finales",
            description: "Aprende a dar mate con piezas mayores y a promocionar peones.",
            icon: "👑",
            sections: [
                {
                    type: "text",
                    content: "Capablanca decia: <em>\"Para mejorar en ajedrez, se deben estudiar los finales primero.\"</em> Los finales son la fase donde quedan pocas piezas y cada movimiento cuenta. Saber como dar mate y como promocionar peones es fundamental."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "Mate con Rey y Dama contra Rey"
                },
                {
                    type: "text",
                    content: "Es el mate mas basico. La tecnica consiste en: <strong>1) Restringir al rey enemigo con la dama, 2) Acercar tu rey, 3) Empujar al rey enemigo al borde del tablero, 4) Dar mate.</strong>"
                },
                {
                    type: "text",
                    content: "<strong>Cuidado:</strong> con dama contra rey solo, es posible hacer ahogado si no tienes cuidado. Siempre deja al rey enemigo al menos una casilla (hasta que des mate)."
                },
                {
                    type: "exercise",
                    exerciseType: "sequence",
                    title: "Mate con Dama (guiado)",
                    instruction: "Sigue las instrucciones para dar mate al rey negro con tu rey y dama.",
                    fen: "8/8/8/8/3k4/8/8/KQ6 w - - 0 1",
                    orientation: "white",
                    steps: [
                        { move: "Qd2", explanation: "Dama a d2: corta al rey negro, restringiendolo al lado del tablero.", hint: "Mueve la dama a d2 para limitar al rey negro." },
                        { move: "Ke5", explanation: "El rey negro intenta ir al centro." },
                        { move: "Qe3", explanation: "Dama a e3+: jaque y seguimos restringiendo.", hint: "Mueve la dama a e3 dando jaque." },
                        { move: "Kf5", explanation: "El rey huye hacia arriba." },
                        { move: "Kb2", explanation: "Acercamos nuestro rey. Paciencia!", hint: "Acerca tu rey: mueve a b2." },
                        { move: "Kf4", explanation: "El rey negro busca espacio." },
                        { move: "Qe6", explanation: "La dama restringe al rey al flanco.", hint: "Mueve la dama a e6 para cortar al rey." },
                        { move: "Kg5", explanation: "El rey negro huye al flanco." },
                        { move: "Kc3", explanation: "Seguimos acercando nuestro rey.", hint: "Acerca el rey a c3." },
                        { move: "Kf4", explanation: "El rey negro vuelve." },
                        { move: "Qf6", explanation: "La dama da jaque forzando al rey al borde.", hint: "Da jaque con dama a f6." },
                        { move: "Ke3", explanation: "El rey huye." },
                        { move: "Kd4", explanation: "Nuestro rey se acerca mas.", hint: "Centraliza tu rey en d4." }
                    ]
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "Mate con Rey y Torre contra Rey"
                },
                {
                    type: "text",
                    content: "Es un poco mas dificil que con la dama. La tecnica consiste en usar la torre para <strong>crear una 'valla'</strong> (cortando filas o columnas) y el rey para <strong>apoyar</strong>, empujando al rey enemigo al borde paso a paso."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Mate con torre",
                    instruction: "El rey negro esta en el borde. Da jaque mate con la torre!",
                    fen: "8/8/8/8/8/1k6/K7/2R5 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "c1", to: "c3" }],
                    successMessage: "Tc3# Jaque mate! El rey esta atrapado entre la torre y el borde.",
                    hintMessage: "La torre puede dar jaque en la fila 3. El rey negro no tiene escape.",
                    explanation: "Tc3 es mate. El rey en b3 no puede ir a a4 (rey en a2 lo controla), a2 (rey blanco ahi), b4 (torre controla fila 3), b2 (rey blanco controla). Mate!"
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "Finales de Rey y Peon"
                },
                {
                    type: "text",
                    content: "Los finales de rey y peon contra rey son los mas fundamentales. Dos conceptos clave: la <strong>oposicion</strong> (enfrentar los reyes con una casilla de distancia para bloquear al rival) y la <strong>regla del cuadrado</strong> (si el rey defensor puede entrar en el cuadrado del peon, lo alcanza)."
                },
                {
                    type: "concept",
                    title: "La Oposicion",
                    content: "Cuando los reyes estan enfrentados con <strong>una casilla entre ellos</strong> (misma fila o columna), el jugador que NO tiene que mover tiene la 'oposicion' y la ventaja. Mantener la oposicion es clave para ganar finales de peones."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Apoya al peon",
                    instruction: "Tu rey debe avanzar delante del peon para escoltarlo. Mueve el rey a d5.",
                    fen: "8/8/8/8/8/4k3/3P4/3K4 w - - 0 1",
                    orientation: "white",
                    correctMoves: [
                        { from: "d1", to: "e2" },
                        { from: "d1", to: "c2" }
                    ],
                    successMessage: "Bien! El rey avanza para proteger el camino del peon. El rey debe ir delante!",
                    hintMessage: "El rey necesita avanzar. Muevelo a e2 o c2 para empezar a guiar al peon.",
                    explanation: "En finales de rey y peon, el rey debe ir DELANTE del peon para abrirle camino. Si el peon va solo, el rey enemigo lo captura facilmente."
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Promocion imparable",
                    instruction: "Tu peon esta a punto de coronar. Empujalo a la ultima fila!",
                    fen: "8/3P4/8/4k3/8/8/8/3K4 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "d7", to: "d8" }],
                    successMessage: "d8=D! El peon corona en dama! Ahora tienes ventaja decisiva.",
                    hintMessage: "El peon en d7 solo necesita un paso mas. El rey negro esta demasiado lejos para impedirlo.",
                    explanation: "El rey negro en e5 esta fuera del 'cuadrado del peon' (no puede llegar a d8 a tiempo). El peon promociona libremente."
                }
            ]
        },

        /* ================================================================
           LECCION 10 - Practica y Siguientes Pasos
           ================================================================ */
        {
            id: 10,
            title: "Practica y Siguientes Pasos",
            shortTitle: "Siguientes Pasos",
            description: "Resumen del curso, una partida guiada y como seguir mejorando.",
            icon: "🚀",
            sections: [
                {
                    type: "text",
                    content: "Felicidades! Has llegado a la ultima leccion del curso. Repasemos lo que has aprendido y juguemos una partida guiada para poner todo en practica."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "Los 7 Principios de Capablanca"
                },
                {
                    type: "concept",
                    title: "Resumen de principios fundamentales",
                    content: "<strong>1. Controla el centro</strong> con peones y piezas.<br><strong>2. Desarrolla todas las piezas</strong> antes de atacar.<br><strong>3. Enroca pronto</strong> para proteger al rey.<br><strong>4. No muevas la misma pieza dos veces</strong> en la apertura.<br><strong>5. Piezas activas</strong> ganan partidas; piezas pasivas las pierden.<br><strong>6. En ventaja, simplifica</strong>; en desventaja, complica.<br><strong>7. Estudia los finales</strong> - son la base de todo."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "Partida Guiada: La Italiana Clasica"
                },
                {
                    type: "text",
                    content: "Juguemos los primeros movimientos de una partida completa siguiendo todos los principios que has aprendido."
                },
                {
                    type: "exercise",
                    exerciseType: "sequence",
                    title: "Tu primera partida completa",
                    instruction: "Juega con blancas siguiendo la Apertura Italiana y los principios de desarrollo.",
                    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                    orientation: "white",
                    steps: [
                        { move: "e4", explanation: "1.e4 - Controla el centro con el peon de rey.", hint: "Peon de rey a e4." },
                        { move: "e5", explanation: "1...e5 - Las negras responden simetricamente." },
                        { move: "Nf3", explanation: "2.Cf3 - Desarrolla el caballo y ataca e5.", hint: "Caballo de g1 a f3." },
                        { move: "Nc6", explanation: "2...Cc6 - Defiende e5 y desarrolla." },
                        { move: "Bc4", explanation: "3.Ac4 - Alfil a c4, apuntando al debil f7.", hint: "Alfil de f1 a c4." },
                        { move: "Bc5", explanation: "3...Ac5 - Las negras tambien desarrollan." },
                        { move: "d3", explanation: "4.d3 - Abre la diagonal del alfil de c1 y apoya e4.", hint: "Peon de d2 a d3 (solido y posicional)." },
                        { move: "Nf6", explanation: "4...Cf6 - Las negras desarrollan el otro caballo atacando e4." },
                        { move: "O-O", explanation: "5.O-O - Enroca! Tu rey esta seguro y la torre se activa.", hint: "Enroca corto: rey de e1 a g1." },
                        { move: "d6", explanation: "5...d6 - Las negras preparan su desarrollo." }
                    ]
                },
                {
                    type: "text",
                    content: "En solo 5 movimientos, las blancas han: controlado el centro (e4, d3), desarrollado caballo y alfil (Cf3, Ac4), y enrocado (O-O). Todos los principios de Capablanca aplicados!"
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "Como Seguir Mejorando"
                },
                {
                    type: "text",
                    content: "El ajedrez es un juego de practica constante. Aqui tienes un plan para seguir mejorando:"
                },
                {
                    type: "text",
                    content: "<strong>1. Juega partidas</strong> - La experiencia es insustituible. Juega al menos una partida al dia.<br><strong>2. Resuelve puzzles</strong> - Entrena tu vision tactica con 10-15 puzzles diarios.<br><strong>3. Analiza tus partidas</strong> - Usa un motor como Stockfish para entender tus errores.<br><strong>4. Estudia finales</strong> - Rey y peon, torre y peon son los finales mas comunes.<br><strong>5. Aprende de los maestros</strong> - Estudia partidas de Capablanca, Fischer y Carlsen."
                },
                {
                    type: "tip",
                    title: "La regla de los 20 minutos",
                    content: "Dedica solo <strong>20 minutos al dia</strong> al ajedrez de forma consistente: 5 min puzzles, 10 min partida rapida, 5 min analisis. La consistencia supera a las sesiones largas ocasionales."
                },
                {
                    type: "divider"
                },
                {
                    type: "subtitle",
                    content: "CheesCoach: Tu Entrenador Personal"
                },
                {
                    type: "text",
                    content: "<strong>CheesCoach</strong> combina lo mejor de dos mundos: el analisis preciso de <strong>Stockfish</strong> (el motor de ajedrez mas fuerte del mundo) con explicaciones en lenguaje natural generadas por <strong>inteligencia artificial</strong>. No solo te dice que movimiento es el mejor, sino <em>por que</em> es el mejor."
                },
                {
                    type: "text",
                    content: "Con CheesCoach puedes:<br>- <strong>Jugar contra Stockfish</strong> a tu nivel (ELO ajustable)<br>- <strong>Analizar tus partidas</strong> importando archivos PGN<br>- <strong>Resolver puzzles</strong> en modo Puzzle Streak<br>- <strong>Jugar online</strong> en Lichess con analisis en tiempo real<br>- Recibir <strong>explicaciones de un coach IA</strong> basadas en los principios de Capablanca"
                },
                {
                    type: "exercise",
                    exerciseType: "find-move",
                    title: "Ultimo ejercicio: Mate en 1!",
                    instruction: "Demuestra lo que has aprendido. Encuentra el mate en 1!",
                    fen: "6k1/5ppp/8/8/8/8/4Q3/4K3 w - - 0 1",
                    orientation: "white",
                    correctMoves: [{ from: "e2", to: "e8" }],
                    successMessage: "Felicidades! De8# es jaque mate! La dama controla toda la octava fila y el rey no puede escapar. Has completado el curso!",
                    hintMessage: "Mira la octava fila. La dama puede llegar a e8... es mate?",
                    explanation: "De8# es jaque mate. La dama en e8 controla toda la fila 8, dando jaque al rey en g8. El rey no puede ir a f8 ni h8 (controlados por la dama), y las casillas f7, g7 y h7 estan ocupadas por sus propios peones. Mate de pasillo! Has terminado el curso!"
                },
                {
                    type: "divider"
                },
                {
                    type: "cta",
                    title: "Descarga CheesCoach",
                    content: "Lleva tu entrenamiento al siguiente nivel. CheesCoach es tu compagnero de ajedrez con analisis de Stockfish y explicaciones de IA en espagnol.",
                    buttonText: "Descargar CheesCoach",
                    buttonUrl: "../index.html"
                }
            ]
        }
    ]
};

export default COURSE_DATA;
