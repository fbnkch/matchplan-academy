import type { StudyChapter, StudySection } from '../course-study';
import type { LearningResource } from './resources';

const gitBook = 'https://git-scm.com/book/en/v2';
const gitDocs = 'https://git-scm.com/docs';
const githubDocs = 'https://docs.github.com';
const localPractice = 'https://github.com/fbnkch/matchplan-academy/tree/main/Beispielprojekte';

function reading(title: string, url: string, action: string): LearningResource {
  return {
    title,
    url,
    action,
    environment: 'Offizielle Dokumentation; Übungen lokal in deiner IDE',
    kind: 'Tutorial',
  };
}

function commandExample(
  code: string,
  expected: string,
  explanation: string,
): StudySection['example'] {
  return { code, expected, explanation, language: 'shell' };
}

/** Theory and manual lab tasks. No Git command is executed by the website. */
export const gitStudyChapters: StudyChapter[] = [
  {
    id: 'study-git-basics',
    trackId: 'engineering',
    title: 'Git: Änderungen verstehen und gezielt speichern',
    lead: 'Arbeitsverzeichnis, Index, Commit und Remote auseinanderhalten. Danach weißt du, welchen Stand du gerade bearbeitest und was du abgeben würdest.',
    sections: [
      {
        title: 'Git-Schnellreferenz',
        paragraphs: [
          'Schlage eine Operation hier nach und lies vor einer Änderung das zugehörige Kapitel. Platzhalter wie <datei> oder <branch> ersetzt du durch dein geprüftes Ziel. Die Befehle sind keine Folge zum blinden Kopieren. Beginne im separaten Git-Labor.',
        ],
        commands: [
          {
            command: 'git status --short --branch',
            purpose: 'Branch sowie gestagte, ungestagte und unversionierte Dateien erkennen.',
          },
          {
            command: 'git diff / git diff --staged',
            purpose: 'Arbeitsänderungen beziehungsweise den geplanten Commit lesen.',
          },
          {
            command: 'git add -p / git add -- <datei>',
            purpose:
              'Einzelne Abschnitte beziehungsweise eine konkrete Datei für den Commit auswählen.',
          },
          {
            command: 'git restore --staged <datei>',
            purpose: 'Auswahl aus dem Index nehmen; die Arbeitsdatei behalten.',
          },
          {
            command: 'git restore --worktree <datei>',
            purpose: 'Ungestagte Arbeitsänderungen der Datei verwerfen; vorher den Diff sichern.',
          },
          {
            command: 'git commit / git show HEAD',
            purpose: 'Ausgewählten Stand speichern beziehungsweise den letzten Commit lesen.',
          },
          {
            command: 'git log --oneline --graph --decorate --all',
            purpose: 'Commit-Beziehungen und Branch-Verweise erkennen.',
          },
          {
            command: 'git init / git clone <url>',
            purpose:
              'Ein neues Repository anlegen beziehungsweise ein bestehendes samt Historie kopieren.',
          },
          {
            command: 'git switch <branch> / git switch -c <branch>',
            purpose: 'Branch wechseln beziehungsweise einen neuen Arbeitsbranch anlegen.',
          },
          {
            command: 'git branch -vv / git remote -v',
            purpose:
              'Upstream-Zuordnung und Remote-Adressen prüfen; Zugangstokens in URLs vermeiden.',
          },
          {
            command: 'git fetch origin',
            purpose: 'Remote-Stände abrufen, ohne sie in den aktuellen Branch zu integrieren.',
          },
          {
            command: 'git fetch --prune origin',
            purpose:
              'Zusätzlich veraltete Remote-Tracking-Verweise entfernen; lokale Branches bleiben erhalten.',
          },
          {
            command: 'git merge --ff-only origin/main',
            purpose: 'Nur vorwärts bewegen; bei auseinanderlaufender Historie stoppen.',
          },
          {
            command: 'git merge origin/main',
            purpose: 'Den abgerufenen Stand in deinen aktuellen Branch integrieren.',
          },
          {
            command: 'git rebase origin/main',
            purpose:
              'Eigene ungeteilte Commits auf neuer Basis neu erzeugen; ihre IDs ändern sich.',
          },
          {
            command: 'git pull --ff-only',
            purpose:
              'Abrufen und nur bei möglichem Fast-forward integrieren; Upstream vorher prüfen.',
          },
          {
            command: 'git push -u origin <branch>',
            purpose:
              'Branch übertragen und einen Upstream setzen; Remote und Berechtigung vorher prüfen.',
          },
          {
            command: 'git merge --abort / git rebase --abort',
            purpose:
              'Den jeweils laufenden Vorgang abbrechen; vor Beginn einen sauberen Arbeitsstand sicherstellen.',
          },
          {
            command: 'git rebase --continue',
            purpose: 'Rebase nach geprüfter und gestagter Konfliktauflösung fortsetzen.',
          },
          {
            command: 'git stash push -u / git stash apply',
            purpose:
              'Arbeit einschließlich unversionierter Dateien vorübergehend sichern beziehungsweise wieder anwenden.',
          },
          {
            command: 'git revert <commit-id>',
            purpose:
              'Eine isolierte Änderung durch einen neuen Gegen-Commit zurücknehmen; Merge-Sonderfall beachten.',
          },
          {
            command: 'git reflog / git branch rescue/<name> <id>',
            purpose:
              'Lokale Verweisbewegungen untersuchen und einen gefundenen Commit zusätzlich sichern.',
          },
          {
            command: 'git cherry-pick <commit-id>',
            purpose:
              'Eine ausgewählte Änderung als neuen Commit übernehmen; Abhängigkeiten prüfen.',
          },
          {
            command: 'git bisect start / good / bad / reset',
            purpose:
              'Eine Regression anhand eines reproduzierbaren Prüffalls eingrenzen und die Suche beenden.',
          },
          {
            command: 'git worktree add <pfad> <branch>',
            purpose: 'Einen weiteren Checkout bereitstellen; Branchbelegung und Zielordner prüfen.',
          },
          {
            command: 'git tag -a <version> -m <beschreibung>',
            purpose:
              'Einen lokalen Stand annotiert markieren; dies veröffentlicht und deployt noch nichts.',
          },
          {
            command: 'git check-ignore -v <datei> / git ls-files',
            purpose: 'Ignore-Regel beziehungsweise bereits versionierte Dateien prüfen.',
          },
          {
            command: 'git rev-parse HEAD / git status --porcelain',
            purpose: 'Commit-ID und zusätzliche lokale Änderungen für einen Datenlauf festhalten.',
          },
          {
            command: 'git config --show-origin --get <schlüssel>',
            purpose: 'Eine Einstellung und die Herkunft der Konfiguration nachsehen.',
          },
          {
            command: 'git help <befehl>',
            purpose: 'Optionen anhand der lokal installierten Git-Version nachlesen.',
          },
        ],
      },
      {
        title: 'Ein Commit ist ein nachvollziehbarer Stand',
        paragraphs: [
          'Git speichert versionierte Projektstände und ihre Beziehungen. Ein Commit verweist auf einen Dateibaum, seine Eltern und Metadaten. Seine ID identifiziert diesen Commit. Ein Branch ist ein beweglicher Verweis auf einen Commit; HEAD zeigt normalerweise auf den gerade ausgecheckten Branch. GitHub ergänzt Hosting, Pull Requests und Berechtigungen. Lokal funktioniert Git auch ohne GitHub.',
          'Arbeitsverzeichnis und Index sind getrennt: Du bearbeitest eine Datei im Arbeitsverzeichnis, wählst mit add den Inhalt für den nächsten Commit aus und speicherst genau diese Auswahl mit commit. Bearbeitest du die Datei nach add erneut, enthält der Index weiterhin die zuvor ausgewählte Fassung. Unversionierte Dateien kommen erst nach dem Hinzufügen dazu. Ein Commit lädt noch nichts zu einem Server hoch.',
        ],
        diagram: {
          title: 'Vom Arbeitsverzeichnis zum Remote',
          url: '/diagrams/git-working-tree.html',
          summary:
            'Verfolge, welcher Befehl Inhalt auswählt, lokal speichert oder mit einem anderen Repository austauscht.',
          steps: [
            'Bearbeiten verändert das Arbeitsverzeichnis.',
            'git add wählt einen Stand für den Index aus.',
            'git commit erzeugt daraus einen lokalen Commit.',
            'git push überträgt erreichbare Objekte und aktualisiert einen erlaubten Remote-Verweis.',
            'git fetch aktualisiert Remote-Tracking-Verweise; dein Arbeitsverzeichnis wird dadurch nicht zusammengeführt.',
          ],
        },
      },
      {
        title: 'Vor dem Speichern den tatsächlichen Unterschied lesen',
        paragraphs: [
          'status zeigt Branch und Dateizustände. diff zeigt Änderungen zwischen Arbeitsverzeichnis und Index; diff --staged zeigt den geplanten Commit gegenüber HEAD. Unversionierte Dateien erscheinen nicht im normalen diff. Prüfe sie ausdrücklich. Mit add -p wählst du einzelne Abschnitte aus, wenn zwei Änderungen dieselbe Datei betreffen.',
          'Ein guter Commit löst eine abgrenzbare Aufgabe: etwa einen Timeout behandeln oder eine falsche Einheit korrigieren. Trenne eine Umbenennung von einer fachlichen Änderung, wenn das die Prüfung erleichtert. Beschreibe im Betreff das Ergebnis und im optionalen Text den Grund. Conventional Commits sind eine Teamkonvention, keine Voraussetzung für ordentliches Git.',
        ],
        example: commandExample(
          'git status --short --branch\ngit diff\ngit add -p\ngit diff --staged\ngit commit -m "Handle API timeouts without replacing the last snapshot"\ngit show --stat HEAD',
          'Der Commit enthält nur die ausgewählten Änderungen. Ein zweiter, nicht ausgewählter Bearbeitungsschritt bleibt im Arbeitsverzeichnis.',
          'Im separaten Übungsrepository ausführen. Prüfe vor commit den gestagten Inhalt; ein erfolgreicher Commit beweist noch keine korrekte Berechnung.',
        ),
        selfCheck: {
          question:
            'Du führst add aus, änderst dieselbe Datei noch einmal und committest. Welche Fassung wird gespeichert?',
          answer:
            'Die Fassung im Index zum Zeitpunkt von add. Die spätere Änderung bleibt ungestagt. Vergleiche diff und diff --staged vor dem Commit.',
        },
      },
      {
        title: 'Ein Projekt beginnen oder übernehmen',
        paragraphs: [
          'init beginnt ein Repository in einem neuen Projektordner; clone übernimmt ein vorhandenes Repository samt Historie. Ein Quellcode-ZIP enthält normalerweise keine .git-Historie. Die Originalprojekte in Beispielprojekte kannst du deshalb lesen und lokal verändern, aber ihre vergangenen Commits erst nach einem echten Clone untersuchen. Initialisiere kein verschachteltes Repository im Website-Projekt.',
          'Richte Namen und E-Mail bewusst ein. Für ein öffentliches Portfolio kannst du eine von deinem Hostinganbieter bereitgestellte private Commit-Adresse verwenden. SSH oder HTTPS mit Credential Manager dienen dem Zugriff. Tokens gehören nicht in Remote-URLs. Mit config --show-origin findest du heraus, aus welcher lokalen oder globalen Konfiguration eine Einstellung stammt.',
        ],
      },
      {
        title: 'Dateien, die nicht in die Historie gehören',
        paragraphs: [
          'Ignoriere lokale Umgebungen, Caches, Zugangsdaten und private Rohdaten. Teile eine leere Konfigurationsvorlage und ein Startkommando. .gitignore verhindert keine bereits versionierte Datei und entfernt keine früheren Inhalte. git check-ignore -v erklärt eine Ignore-Regel; git ls-files zeigt, was bereits versioniert wird.',
          'Bei einem veröffentlichten Secret sperrst oder rotierst du zuerst den Zugang. Danach bereinigst du mit dem zuständigen Team die aktuelle Fassung und gegebenenfalls die Historie. Das Löschen in einem neuen Commit oder ein privates Repository macht ein geleaktes Token nicht wieder geheim. Prüfe vor einem Commit auch Notebook-Ausgaben, Screenshots und Logs.',
          'Gerade zwischen Windows und Linux können Zeilenenden unnötige Diffs verursachen. Eine vereinbarte .gitattributes beschreibt Textnormalisierung und Binärdateien im Repository; die lokale Git-Konfiguration kann zusätzlich wirken. Prüfe eine solche Änderung getrennt von einer Berechnung. git diff --check meldet unter anderem typische Whitespace-Probleme und verbliebene Konfliktmarker, bewertet aber keine Fachlogik.',
        ],
      },
    ],
    questions: [
      'Was zeigen diff und diff --staged jeweils?',
      'Warum sind Branch, Ordner und Umgebung verschiedene Dinge?',
      'Welche deiner Projektdateien dürfen öffentlich sein?',
    ],
    build: {
      title: 'Git-Labor neben dem Saison-Dashboard',
      url: localPractice,
      brief:
        'Öffne git_lab.py im Saisonprojekt. Lies zuerst dessen Hilfe und richte das Labor in einem eigenen Ordner außerhalb bestehender Repositories ein. Bearbeite dort die Runden 1 und 2.',
      acceptance: [
        'Du kannst einen gestagten und einen ungestagten Unterschied erklären.',
        'Ein Commit enthält eine fachliche Änderung und keinen lokalen Datenstand.',
        'Du findest Commit-ID, Autor und Änderung mit log und show wieder.',
      ],
    },
    media: [
      reading(
        'Pro Git: Änderungen aufzeichnen',
        `${gitBook}/Git-Basics-Recording-Changes-to-the-Repository`,
        'Vergleiche die vier Dateizustände mit deinem Labor. Sage die Ausgabe von status vor jeder Änderung voraus.',
      ),
      reading(
        'Git: ignore-Regeln',
        `${gitDocs}/gitignore`,
        'Prüfe, weshalb eine ignorierte, aber bereits versionierte Datei weiterhin in Git auftaucht.',
      ),
    ],
    practiceIds: [],
  },
  {
    id: 'study-git-branches',
    trackId: 'engineering',
    title: 'Branches, Remotes und ein kleiner Änderungsauftrag',
    lead: 'Einen Arbeitsbranch anlegen, eingehende Änderungen verstehen und Merge oder Rebase passend zum Team wählen.',
    sections: [
      {
        title: 'Kurze Branches mit einer klaren Aufgabe',
        paragraphs: [
          'Ein Branch wie feat/rolling-form bekommt einen konkreten Auftrag und überprüfbare Bedingungen: etwa die letzten fünf abgeschlossenen Partien auswerten und fehlende Einsätze kenntlich machen. Kleine Änderungen lassen sich leichter prüfen und zurücknehmen. Ein Branch ist keine vollständige Kopie des Projekts und keine eigene Produktionsumgebung.',
          'Für dein erstes Projekt genügt main mit kurzen Arbeitsbranches. Langlebige Release-Branches lohnen sich erst, wenn du mehrere ausgelieferte Versionen pflegen musst. Übernimm einen aufwendigen Gitflow nicht allein wegen der Branch-Namen. Nach der Integration kannst du einen nicht mehr benötigten lokalen Branch mit branch -d löschen; prüfe bei einem Squash die erfolgte Integration, bevor du eine erzwungene Löschung erwägst.',
          'Beginne von einem sauberen, aktuellen Ausgangsstand. switch wechselt Branches, switch -c legt einen neuen an. Git verhindert manche Wechsel, bei denen lokale Änderungen überschrieben würden. Verlasse dich trotzdem auf status und sichere einen verständlichen Zwischenstand. stash kann kurzfristig helfen; unversionierte Dateien werden erst mit -u aufgenommen. Ignorierte Dateien bleiben dabei außen vor.',
        ],
        example: commandExample(
          'git status\ngit fetch origin\ngit switch main\ngit merge --ff-only origin/main\ngit switch -c feat/rolling-form',
          'main bewegt sich nur dann vorwärts, wenn ein Fast-forward möglich ist. Bei auseinanderlaufender Historie stoppt merge --ff-only, statt unbemerkt einen Merge-Commit zu erzeugen.',
          'Das Beispiel setzt ein vorhandenes origin/main und eine saubere Arbeitskopie voraus. Im Labor heißt der Arbeitsclone analyst; origin verweist dort ausschließlich auf ein lokales Bare-Repository.',
        ),
      },
      {
        title: 'origin/main ist eine lokale Beobachtung',
        paragraphs: [
          'origin ist ein konventioneller Remote-Name, keine besondere Git-Rolle. origin/main ist ein lokaler Remote-Tracking-Verweis, der durch fetch aktualisiert wird. Dein Branch main kann davor, dahinter oder seitlich davon liegen. fetch lädt die erreichbaren Objekte und aktualisiert passende Verweise; es integriert sie nicht in deinen aktuellen Branch.',
          'pull verbindet Abruf und Integration; ob dabei Merge, Rebase oder nur Fast-forward erlaubt ist, hängt von Optionen und Konfiguration ab. Für den Einstieg sind fetch und ein ausdrücklicher Integrationsschritt leichter nachzuvollziehen. push -u origin feat/rolling-form veröffentlicht den Branch und richtet dessen Upstream ein. Eine Ablehnung wegen neuerer Remote-Commits löst du durch Prüfen und Integrieren, nicht durch einen reflexhaften Force-Push.',
        ],
      },
      {
        title: 'Merge bewahrt Verzweigung, Rebase schreibt Commits neu',
        paragraphs: [
          'Ein Merge integriert zwei Entwicklungsstände; bei auseinanderlaufenden Linien entsteht gewöhnlich ein Commit mit zwei Eltern. Ein Fast-forward bewegt lediglich den Zielverweis weiter. Ein Rebase spielt die Änderungen deiner Commits auf einer anderen Basis neu ab. Dabei entstehen neue Commit-IDs. Das ist hilfreich für eigene, noch nicht geteilte Branches und problematisch, wenn andere auf der alten Linie arbeiten.',
          'Im Team gilt die vereinbarte Strategie. Squash-Merge bündelt einen Pull Request in einem neuen Commit; einzelne Branch-Commits erscheinen dann nicht einzeln auf main. Rebase-Merge linearisiert, ein Merge-Commit erhält die Verzweigung. Erkläre die Folgen, statt eine Strategie als immer überlegen zu behandeln. --force-with-lease schützt vor manchen unbemerkten Remote-Änderungen, ist aber weder eine Freigabe zum Umschreiben geteilter Historie noch ein Ersatz für Absprachen.',
        ],
        example: commandExample(
          'git fetch origin\ngit log --oneline --graph --decorate --all\ngit log --oneline origin/main..HEAD\n# Auf einem eigenen, noch nicht geteilten Branch:\ngit rebase origin/main\n# Bei Bedarf während dieses Rebase:\ngit rebase --abort',
          'Vor dem Rebase erkennst du die beiden Linien. Nach einem erfolgreichen Rebase liegen die eigenen Änderungen auf der neuen Basis und haben neue IDs.',
          'Führe rebase nur im dafür vorgesehenen Laborfall aus. --abort ist während eines laufenden Rebase verfügbar; nach Abschluss brauchst du einen anderen Wiederherstellungsweg.',
        ),
        selfCheck: {
          question:
            'Nach fetch ist origin/main neuer, dein Branch unverändert. Ist der Abruf fehlgeschlagen?',
          answer:
            'Nein. Genau das ist die Trennung zwischen Abruf und Integration. Prüfe den Graphen und wähle danach die im Team erlaubte Merge- oder Rebase-Strategie.',
        },
      },
      {
        title: 'Weitere Werkzeuge erst bei einer passenden Aufgabe',
        paragraphs: [
          'cherry-pick überträgt die Änderung eines ausgewählten Commits in einen neuen Commit. Das kann einen Hotfix auf eine gepflegte Release-Linie bringen; prüfe Abhängigkeiten und vermeide versehentliche Doppelungen. worktree stellt einen weiteren Checkout desselben Repositorys bereit, etwa für eine dringende Korrektur neben einem unfertigen Experiment.',
          'Bei einem Fork zeigt origin häufig auf deinen Fork und upstream auf das Ursprungsprojekt. Die Namen sind frei wählbar. Ein Submodule verweist auf einen bestimmten Stand eines separaten Repositorys und bringt zusätzliche Clone- und Update-Schritte mit. Erkenne .gitmodules in fremden Projekten, bevor du fehlende Dateien als eigenen Fehler deutest.',
        ],
      },
    ],
    questions: [
      'Welchen Stand beschreibt origin/main?',
      'Weshalb ändern sich Commit-IDs beim Rebase?',
      'Was geht beim Squash als einzelne Historie auf main verloren?',
    ],
    build: {
      title: 'Zwei lokale Arbeitskopien statt einer simulierten Webseite',
      url: localPractice,
      brief:
        'Bearbeite Laborrunde 3. Die Arbeitskopien analyst und reviewer teilen ein lokales Remote. Lass reviewer eine unabhängige Änderung liefern und untersuche den Graphen vor und nach fetch.',
      acceptance: [
        'Du kannst eigene, eingehende und gemeinsame Commits im Graphen zeigen.',
        'Dein Feature-Branch hat einen passenden Namen und einen kleinen Auftrag.',
        'Du begründest die gewählte Integration und erkennst einen abgelehnten Push.',
      ],
    },
    media: [
      reading(
        'Pro Git: Remote-Branches',
        `${gitBook}/Git-Branching-Remote-Branches`,
        'Zeichne main, origin/main und deinen Feature-Branch mit ihren tatsächlichen Commit-IDs auf.',
      ),
      reading(
        'Pro Git: Rebasing',
        `${gitBook}/Git-Branching-Rebasing`,
        'Vergleiche das Ergebnis eines Merge mit dem eines Rebase. Lies besonders die Folgen für bereits geteilte Commits.',
      ),
      reading(
        'Git: worktree',
        `${gitDocs}/git-worktree`,
        'Ordne zusätzliche Checkouts von unabhängigen Clones ab.',
      ),
    ],
    practiceIds: [],
  },
  {
    id: 'study-git-recovery',
    trackId: 'engineering',
    title: 'Konflikte lösen und Änderungen sicher zurücknehmen',
    lead: 'Den fachlich richtigen Stand finden, einen begonnenen Vorgang abbrechen und gespeicherte Arbeit wiederfinden.',
    sections: [
      {
        title: 'Ein Konflikt ist eine fachliche Entscheidung',
        paragraphs: [
          'Git kann viele Textänderungen zusammenführen. Bei konkurrierenden Änderungen markiert es unaufgelöste Stellen. Lies beide Absichten und die gemeinsame Ausgangsfassung. Wenn eine Seite Fenstergröße fünf und die andere einen Filter für abgeschlossene Spiele ergänzt, kann die richtige Lösung beide Regeln benötigen. Das blinde Behalten einer Seite verliert Funktionalität.',
          'Lies status, bearbeite die betroffenen Dateien, entferne Konfliktmarker und prüfe das Ergebnis fachlich. Danach markiert add die Auflösung. Bei einem Merge schließt du mit commit ab; bei einem Rebase setzt du mit rebase --continue fort. ours und theirs beziehen sich auf den jeweiligen Vorgang und wirken beim Rebase oft anders als erwartet. Lies den Inhalt statt nur einen IDE-Button auszuwählen.',
        ],
        example: commandExample(
          'git status\ngit diff --name-only --diff-filter=U\n# Konflikt in der IDE lösen und eigene Prüffälle ausführen.\ngit add analysis_config.toml\ngit diff --staged\ngit commit\n# Alternative während eines noch laufenden Merge:\n# git merge --abort',
          'Die Auflösung enthält die vereinbarte Fachregel und keine Marker wie <<<<<<<. Der Vorgang wird bewusst abgeschlossen oder abgebrochen.',
          'Vor Merge oder Rebase sollte der Arbeitsstand sauber sein. Ein Abbruch kann bereits zuvor vorhandene lokale Änderungen nicht in jedem Fall zuverlässig rekonstruieren.',
        ),
      },
      {
        title: 'restore, reset und revert lösen verschiedene Probleme',
        paragraphs: [
          'restore --staged nimmt eine Datei aus dem geplanten Commit und lässt die Arbeit normalerweise erhalten. restore --worktree setzt den Arbeitsinhalt standardmäßig auf den Index zurück und verwirft dabei ungestagte Änderungen dieser Datei. reset kann den Branch-Verweis und je nach Modus Index oder Arbeitsverzeichnis verändern. --hard ist deshalb kein gewöhnlicher Aufräumschritt.',
          'Bei reset auf einen Commit bewegt --soft den aktuellen Verweis und behält Index und Arbeitsdateien. --mixed setzt zusätzlich den Index zurück und lässt Arbeitsdateien bestehen; das ist der Standardmodus. --hard gleicht auch die Arbeitsdateien an und kann Änderungen verlieren. Diese Beschreibung betrifft reset auf einen Commit; eine pfadbezogene Index-Korrektur hat eine andere Wirkung. Lies vor dem Einsatz die konkrete Form nach.',
          'Für einen bereits geteilten fehlerhaften Commit ist revert meist der passende Einstieg: Es erzeugt einen neuen Commit mit einer Gegenänderung. Beim Rücknehmen eines Merge-Commits muss die beizubehaltende Elternlinie bewusst gewählt werden; das beeinflusst auch spätere Merges. Eine Code-Rücknahme repariert keine bereits versandten Nachrichten, geänderten Daten oder ausgeführten Datenbankmigrationen automatisch.',
        ],
        selfCheck: {
          question:
            'Eine falsche Filterregel ist bereits auf main geteilt. Willst du die Historie zurücksetzen oder die Änderung nachvollziehbar zurücknehmen?',
          answer:
            'Üblicherweise erzeugst du eine Gegenänderung mit revert auf einem Korrekturbranch und lässt sie prüfen. Bei einem Merge-Commit klärst du vorher die Elternlinie. Für schon veränderte Daten brauchst du einen gesonderten Korrekturplan.',
        },
      },
      {
        title: 'Verlorene Commits suchen, bevor du weiteränderst',
        paragraphs: [
          'log zeigt die von gewählten Verweisen erreichbare Historie. reflog zeigt lokale Bewegungen von Verweisen wie HEAD. Nach einem versehentlichen Rebase findest du darüber möglicherweise den alten Commit und sicherst ihn zunächst mit einem neuen Branch. Verwende die echte gefundene Commit-ID, keine aus einem Tutorial kopierte ID.',
          'Reflogs sind lokal, zeitlich begrenzt und kein dauerhaftes Backup. Nie gespeicherte Änderungen sind darüber nicht generell wiederherstellbar. Nutze zusätzlich IDE-Verlauf und passende Sicherungen. amend und interaktiver Rebase eignen sich zum Ordnen eigener ungeteilter Commits; bei geteilter Historie brauchst du die Teamabsprache.',
        ],
        example: commandExample(
          'git reflog --date=local\n# Erst den gefundenen Commit lesen:\ngit show <gefundene-commit-id>\n# Danach einen zusätzlichen Verweis sichern:\ngit branch rescue/previous-analysis <gefundene-commit-id>',
          'Der rescue-Branch macht den gefundenen Stand wieder erreichbar, ohne den aktuellen Branch zurückzusetzen.',
          'Die Platzhalter werden durch selbst geprüfte IDs ersetzt. Die Befehle dienen der Erklärung; die Website führt sie nicht aus.',
        ),
      },
      {
        title: 'Eine Regression auf einen Commit eingrenzen',
        paragraphs: [
          'Mit bisect suchst du zwischen einem bekannten guten und einem bekannten schlechten Commit nach der verursachenden Änderung. Dazu brauchst du einen verlässlichen Prüffall: dieselbe Eingabe muss unter denselben Bedingungen dasselbe Urteil liefern. Ein flüchtiger Live-API-Fehler eignet sich dafür schlecht.',
          'Sichere den Arbeitsstand, führe die Suche in einer eigenen Arbeitskopie aus und beende sie mit bisect reset. blame zeigt die letzte Änderung einer Zeile, aber nicht automatisch die Ursache des Fehlers. Lies zugehörigen Commit und Pull Request. Prüfe bei Analysen auch Datenrevision und Paketversion; identischer Code kann mit anderen Eingaben ein anderes Ergebnis liefern.',
        ],
      },
    ],
    questions: [
      'Welche beiden Absichten muss deine Konfliktauflösung erhalten?',
      'Was könnte ein Revert an echten Daten nicht rückgängig machen?',
      'Wann hilft reflog und wann nicht?',
    ],
    build: {
      title: 'Konflikt- und Wiederherstellungsrunde',
      url: localPractice,
      brief:
        'Bearbeite Runden 4 und 5. Erzeuge einen Konflikt ausschließlich im Git-Labor, löse ihn aus der Fachfrage heraus und nimm anschließend eine eigene isolierte Fehländerung zurück.',
      acceptance: [
        'Du dokumentierst beide Absichten und deinen resultierenden Prüffall.',
        'Du unterscheidest Abbruch, Unstaging und Gegenänderung.',
        'Du kannst einen früheren Commit lesen und über einen rescue-Branch sichern.',
      ],
    },
    media: [
      reading(
        'Git: revert',
        `${gitDocs}/git-revert`,
        'Lies die Bedeutung des neuen Gegen-Commits und den Sonderfall eines Merge-Commits.',
      ),
      reading(
        'Git: restore',
        `${gitDocs}/git-restore`,
        'Vergleiche --staged und --worktree am Laborfall.',
      ),
      reading(
        'Git: reflog',
        `${gitDocs}/git-reflog`,
        'Suche eine lokale Branchbewegung und erkläre die Grenzen der Wiederherstellung.',
      ),
      reading(
        'Git: bisect',
        `${gitDocs}/git-bisect`,
        'Formuliere einen deterministischen Prüffall, bevor du eine Suche beginnst.',
      ),
    ],
    practiceIds: [],
  },
  {
    id: 'study-git-team',
    trackId: 'engineering',
    title: 'Vom Pull Request zum nachvollziehbaren Release',
    lead: 'Code prüfen lassen, CI verstehen und einen Produktionsstand bewusst ausliefern.',
    sections: [
      {
        title: 'Ein Pull Request erklärt eine Änderung',
        paragraphs: [
          'Ein Pull Request vergleicht einen Head-Branch mit einer Zielbasis und hält Diskussion sowie Prüfungen fest. Beschreibe das konkrete Problem, das neue Verhalten und den Nachweis. Bei einem Punkte-pro-Preis-Filter gehören Einheit, Umgang mit fehlenden Preisen und ein handgerechneter Fall in die Beschreibung. Ein langer Text ersetzt keinen kleinen verständlichen Diff.',
          'Lies den eigenen Diff vor der Review. Reagiere auf Rückfragen mit einer Begründung oder einer gezielten Korrektur. Ein neuer Push kann frühere Freigaben oder Checks entwerten; maßgeblich ist der tatsächlich zu integrierende Stand. In deinem Einzelprojekt übst du diese Rolle durch eine zeitversetzte zweite Durchsicht. Das ist keine unabhängige Kolleg:innen-Review.',
        ],
      },
      {
        title: 'CI und geschützte Branches',
        paragraphs: [
          'Continuous Integration prüft Änderungen in einer dokumentierten Umgebung: zum Beispiel Format, Typen, gezielte Tests und Build. Ein grüner Lauf bestätigt nur diese Prüfungen für den getesteten Stand. Ein Dienst kann trotzdem fachlich falsche Zahlen anzeigen. Ergänze nachvollziehbare Datenverträge und eine kleine fachliche Kontrolle.',
          'Branchregeln oder Rulesets können Direktänderungen, Force-Pushes und das Zusammenführen ohne erforderliche Checks beschränken. Verfügbarkeit und genaue Einstellungen hängen vom Hosting und Tarif ab. Eine Merge Queue prüft anstehende Änderungen gegen den vorgesehenen Integrationsstand. Richte keine Review-Regel ein, die du im Solo-Projekt nicht erfüllen kannst; dokumentiere stattdessen den tatsächlichen Review-Prozess.',
        ],
        diagram: {
          title: 'Ein Änderungsauftrag bis zur Auslieferung',
          url: '/diagrams/git-change-workflow.html',
          summary:
            'Prüfung und Auslieferung sind eigene Schritte. Ein Commit oder Merge ist für sich noch kein Produktionsnachweis.',
          steps: [
            'Einen kleinen Auftrag auf einem Feature-Branch bearbeiten.',
            'Einen geprüften Commit in einen Pull Request geben.',
            'CI auswerten und die Änderung inhaltlich prüfen.',
            'Bei Fehlern den Branch korrigieren und erneut prüfen.',
            'Erst nach den vereinbarten Freigaben integrieren.',
            'Den freigegebenen Stand ausliefern, kontrollieren und bei Bedarf eine Gegenänderung prüfen.',
          ],
        },
      },
      {
        title: 'Build, Release und Deployment auseinanderhalten',
        paragraphs: [
          'Ein Build erzeugt ein Artefakt. Ein Release benennt einen auslieferbaren Stand samt Änderungen; ein Deployment bringt einen Stand in eine Umgebung. Ein Tag verweist auf einen bestimmten Git-Stand und sollte als veröffentlichte Release-Markierung nicht nachträglich umgebogen werden. Notiere Commit-ID, Artefakt, Konfiguration und Datenrevision, damit eine Auslieferung später nachvollziehbar bleibt.',
          'Preview, Staging und Produktion trennen Zugriff, Konfiguration und Daten. Produktionsgeheimnisse gehören in die vorgesehene Secret-Verwaltung. Prüfe bei einem Rollback auch Schema- und Datenkompatibilität: Ein alter Build kann mit einer neuen Datenbank unbrauchbar sein. Nach der Auslieferung kontrollierst du Start, Datenfrische und mindestens einen fachlichen Wert; der abgeschlossene Deploy-Job allein genügt nicht.',
        ],
      },
      {
        title: 'Review mit KI, Verantwortung bei dir',
        paragraphs: [
          'Bitte eine KI zunächst um Fragen zum Diff und zu übersehenen Fehlerfällen. Erkläre danach selbst, welche Eingabe ein Gegenbeispiel wäre. Lass vorgeschlagene Shellbefehle mit ihrem Zielbranch, ihren Nebenwirkungen und ihrem Wiederherstellungsweg begründen. Zugangsdaten und private Ligadaten gehören nicht in den Prompt.',
          'Du solltest jeden abgegebenen Commit erklären und eine kleine Folgeänderung ohne fertige Vorlage umsetzen können. Notiere im Labor, welche Hilfe du gebraucht hast, und wiederhole die gleiche Art Aufgabe später mit einem anderen Datenfall. Eine automatisch erzeugte Freigabe ersetzt weder die Prüfung der Berechnung noch eine unabhängige Review.',
        ],
      },
    ],
    questions: [
      'Welcher Commit und welche Eingaben wurden tatsächlich geprüft?',
      'Was unterscheidet einen grünen Build von einer korrekten Anzeige?',
      'Welche Folge hätte ein Rollback für bereits migrierte Daten?',
    ],
    build: {
      title: 'Eine kleine Änderung zur Review vorbereiten',
      url: localPractice,
      brief:
        'Bearbeite Runde 6. Schreibe einen lokalen Pull-Request-Entwurf und einen Release-Nachweis. Ein echter Online-PR folgt erst, wenn du selbst ein eigenes Remote verwendest und veröffentlichen möchtest.',
      acceptance: [
        'Der Entwurf nennt Problem, Verhalten und einen reproduzierbaren Nachweis.',
        'Die CI prüft eine sichere lokale Eingabe ohne Produktionsgeheimnisse.',
        'Der Release-Nachweis nennt Stand, Datenfrische, fachliche Kontrolle und Rücknahmeplan.',
      ],
    },
    media: [
      reading(
        'GitHub: geschützte Branches',
        `${githubDocs}/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches`,
        'Unterscheide gewünschte Teamregeln und die in deinem Account tatsächlich aktivierten Regeln.',
      ),
      reading(
        'GitHub: Deploying code',
        `${githubDocs}/en/pull-requests/concepts/deploying-code`,
        'Verfolge die Trennung von Statuschecks, Integration und Deployment.',
      ),
    ],
    practiceIds: [],
  },
  {
    id: 'study-git-data',
    trackId: 'engineering',
    title: 'Daten, Notebooks und Modelle versionieren',
    lead: 'Ein Analyseergebnis lässt sich erst reproduzieren, wenn neben dem Code auch Eingaben, Umgebung und fachliche Regeln feststehen.',
    sections: [
      {
        title: 'Code-Version und Datenrevision zusammen aufschreiben',
        paragraphs: [
          'Ein aktueller API-Abruf ist keine feste Eingabe. Anbieter korrigieren Events, und Kickbase-Punkte ändern sich im Verlauf einer Saison. Bewahre für erlaubte eigene Snapshots Quelle, Wettbewerb, Saison, Abrufzeit, Schema und Prüfsumme auf. Ein Laufmanifest verbindet diese Datenrevision mit Commit-ID, Parametern und Umgebung.',
          'git rev-parse HEAD nennt den letzten Commit, beweist aber keinen sauberen Arbeitsstand. Eine lokale Änderung kann das Ergebnis verändert haben. Prüfe zusätzlich status oder kennzeichne den Lauf ausdrücklich als dirty. Schreibe Daten und Berichte in getrennte Ausgabepfade. Ein neuer Lauf soll den letzten verlässlichen Stand nicht versehentlich ersetzen.',
        ],
        example: commandExample(
          'git rev-parse HEAD\ngit status --porcelain\n# Im eigenen Laufmanifest zusätzlich festhalten:\n# source, fetched_at_utc, season, schema_version, input_sha256\n# parameters, python_version, dependency_lock, output_sha256',
          'Eine Commit-ID plus leerer Status beschreibt den versionierten Code. Das Manifest beschreibt die konkrete Eingabe und die Ausführungsbedingungen.',
          'Prüfsummen identifizieren Bytes; sie erlauben weder die Weitergabe fremder Daten noch beweisen sie die Qualität des Inhalts.',
        ),
      },
      {
        title: 'Git, Git LFS, DVC und Speicher haben verschiedene Aufgaben',
        paragraphs: [
          'Kleine frei teilbare Fixtures können in Git liegen. Große Rohdaten, private Ligadaten und Modellartefakte benötigen einen bewusst gewählten Speicher und Zugriffsregeln. Git LFS hält Zeiger in Git und große Inhalte in einem separaten Objektspeicher. Ohne den zugehörigen Zugriff und Abruf ist ein Clone deshalb nicht automatisch vollständig.',
          'DVC kann Daten- und Modellstände über Metadaten mit Git verbinden und Inhalte in einem separaten Speicher verwalten. Das ist bei wachsenden Projekten nützlich, für deinen ersten lokalen Snapshot aber kein Pflichtwerkzeug. Starte mit einem sauberen Manifest. Speicherlimits, Gebühren, Verfügbarkeit und Datenlizenzen bleiben unabhängig vom Versionswerkzeug zu prüfen.',
        ],
      },
      {
        title: 'Notebooks mit lesbaren Änderungen',
        paragraphs: [
          'Notebook-Dateien enthalten Code, Metadaten und oft Ausgaben. Ein ausgeführtes Notebook kann personenbezogene Daten oder einen Zugangsschlüssel in einer Zelle zeigen. Prüfe Inhalt und Ausgaben vor dem Commit. Entferne unnötige Laufartefakte; falls Ergebnisse bewusst Bestandteil der Abgabe sind, dokumentiere deren Datenbasis.',
          'Lagere wiederverwendbare Berechnungen in Module aus und starte das Notebook zur Abgabe in einer frischen Sitzung von oben nach unten. Vergleiche die resultierenden Tabellen mit einem Kontrollfall. Ein Notebook-Diff-Werkzeug kann Änderungen lesbarer machen, löst aber keine fachlichen Konflikte. Vermische eine neue Auswertung nicht mit einer massenhaften Änderung von Zellmetadaten.',
        ],
      },
      {
        title: 'Fremde Codebasen mit erhaltener Herkunft lesen',
        paragraphs: [
          'Die gelieferten Sport-Archive sind festgehaltene Originalstände. Lies Einstiegspunkt, Paketkonfiguration, Datenzugriff und einen passenden Test, bevor du eine Abhängigkeit installierst. Bewahre Lizenz und Revision. Für eigene Änderungen kopierst du die Arbeitskopie außerhalb des Website-Repositorys; für eine echte Mitarbeit nutzt du einen Clone beziehungsweise Fork des Ursprungsprojekts.',
          'Unterscheide fremde Referenz, angepasste Funktion und eigene Entscheidung. Stelle einen begrenzten Transfer ins Portfolio: etwa ein Cache-Prinzip von nflreadpy auf deinen eigenen Import übertragen. Übernimm keine fremden Testergebnisse oder Berufsbehauptungen als eigenen Nachweis. Auch mit einer permissiven Code-Lizenz können externe Datensätze andere Bedingungen haben.',
        ],
        selfCheck: {
          question:
            'Derselbe Git-Commit liefert diese Woche einen anderen Tabellenwert. Beweist das einen Codefehler?',
          answer:
            'Nein. Prüfe Datenrevision, API-Abdeckung, Parameter und Paketstände. Auch lokale uncommittete Änderungen können beteiligt sein. Erst eine festgehaltene Eingabe erlaubt einen belastbaren Vergleich.',
        },
      },
    ],
    questions: [
      'Welche Angaben brauchst du, um einen konkreten Tabellenwert später nachzurechnen?',
      'Welche Dateien deines Projekts sind öffentlich teilbar?',
      'Wie unterscheidest du einen aktuellen Abruf von einer reproduzierbaren Eingabe?',
    ],
    build: {
      title: 'Ein Datenlauf mit nachvollziehbarem Stand',
      url: localPractice,
      brief:
        'Bearbeite Runde 7. Verbinde einen sauberen Code-Stand mit einem lokalen Datenmanifest und reproduziere einen Kontrollwert aus derselben erlaubten Eingabe.',
      acceptance: [
        'Das Manifest enthält Daten- und Code-Stand sowie Parameter.',
        'Ein frischer Checkout lässt sich mit dokumentierter Umgebung starten.',
        'Private Daten fehlen in Git; der Wiederbeschaffungsweg ist erklärt.',
      ],
    },
    media: [
      reading(
        'DVC: Daten und Modelle versionieren',
        'https://doc.dvc.org/example-scenarios/versioning-data-and-models',
        'Vergleiche Git-Metadaten und separat gespeicherte Inhalte mit deinem eigenen Manifest.',
      ),
      reading(
        'GitHub: Git LFS',
        `${githubDocs}/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage`,
        'Erkläre, weshalb ein Git-Zeiger noch nicht die große Datei ist.',
      ),
      reading(
        'nflreadpy: echte Paketstruktur',
        'https://github.com/nflverse/nflreadpy',
        'Lies in der gelieferten Arbeitskopie load_pbp.py, downloader.py und cache.py. Übertrage eine Idee in einen eigenen kleinen Commit.',
      ),
    ],
    practiceIds: [],
  },
  {
    id: 'study-delivery',
    trackId: 'advanced',
    title: 'Eine Arbeitsprobe für die erste Bewerbung',
    lead: 'Zeige an einem begrenzten Projekt, was du selbst entscheiden, umsetzen und prüfen kannst. Den Bewerbungsstart musst du nicht bis zur letzten Vertiefung aufschieben.',
    sections: [
      {
        title: 'Eine Rolle wählen und die Abgabe daran messen',
        paragraphs: [
          'Für Data Analysis brauchst du eine klare Frage, korrekte SQL- und Python-Auswertungen und eine verständliche Entscheidungsvorlage. Für Data Engineering zeigst du zusätzlich wiederholbare Importe, Verträge, Fehlerbehandlung, Historisierung und einen verlässlichen Start. Für Data Science kommen Baseline, sinnvoller zeitlicher Test, Unsicherheit und eine begründete Modellwahl dazu.',
          'Diese Rollen überschneiden sich, verlangen aber nicht denselben Nachweis. Wähle eine passende Junior-Ausschreibung und ordne ihre Anforderungen konkreten Dateien oder Ergebnissen zu. Markiere offen, was du nur gelesen, mit Hilfe gebaut oder selbstständig geprüft hast. Eine lange Liste betrachteter Repositories ersetzt diese Zuordnung nicht.',
        ],
      },
      {
        title: 'Der kleine, vollständige Nachweis',
        paragraphs: [
          'Nutze dein Saison-Dashboard als eine zusammenhängende Arbeitsprobe: eine erlaubte reale Quelle, kontrollierter Import, nachvollziehbare Zuordnung, eine sauber definierte Kennzahl und eine Anzeige mit Datenfrische. Zeige einen normalen Lauf und einen Fehlerfall. Beschreibe, welche Managerentscheidung die Kennzahl unterstützt und wo sie nichts aussagt.',
          'Eine andere Person sollte mit der kurzen README Umgebung und Einstieg finden. Ein kleiner Diff oder Pull Request erklärt eine spätere Änderung; der Nachweis zeigt ihren Effekt. Liefere ein verständliches Diagramm, einen prüfbaren Beispielwert und die Grenzen der Daten. Füge eine eigene zweite Auswertung hinzu, damit sichtbar wird, dass du das Prinzip auf eine neue Frage übertragen kannst.',
        ],
      },
      {
        title: 'Ohne Vorlage erklären und weiterarbeiten',
        paragraphs: [
          'Nimm dir eine begrenzte Folgeaufgabe: ein neues API-Feld, einen zusätzlichen Datenvertrag oder einen anderen Vergleichszeitraum. Formuliere die Erwartung, lege einen Branch an und bearbeite sie zunächst ohne fertigen KI-Code. Notiere Blockaden und nutze danach gezielte Hilfen. Wiederhole die Aufgabe mit einer anderen Eingabe.',
          'Erkläre in fünf Minuten den Datenweg und führe anschließend einen Wert von der Oberfläche bis zur Eingabe zurück. Lass dir eine ungeplante Änderung geben und zeige, wie du sie untersuchen würdest. Im Gespräch darfst du Dokumentation nutzen und Unsicherheit benennen. Entscheidend ist, dass du deine nächsten Prüfungen begründen und Hilfe gezielt einholen kannst.',
        ],
        selfCheck: {
          question: 'Wann kannst du mit Bewerbungen beginnen?',
          answer:
            'Wenn du eine für die Zielrolle passende Arbeitsprobe erklären, reproduzieren und begrenzt verändern kannst. Bewirb dich parallel zum Weiterlernen und hole fachliches Feedback ein. Kein Kursabschluss garantiert eine Einstellung; du musst dafür auch nicht alle verlinkten Repositories vollständig durcharbeiten.',
        },
      },
    ],
    questions: [
      'Welche Anforderung deiner Zielrolle beweist welche konkrete Abgabe?',
      'Welche Änderung kannst du ohne Musterlösung durchführen?',
      'Welche Einschränkung würdest du im Vorstellungsgespräch selbst ansprechen?',
    ],
    build: {
      title: 'Projektabgabe und kurze technische Vorstellung',
      url: localPractice,
      brief:
        'Bearbeite die Abschlussrunde des Git-Labors und führe danach eine neue kleine Änderung an deinem echten Saisonprojekt durch. Bitte eine andere Person um einen Lesetest der Abgabe.',
      acceptance: [
        'Die README führt von Fragestellung zu Startkommando und Datenzugang.',
        'Ein unabhängiger Leser kann einen Ergebniswert nachrechnen.',
        'Du erklärst Branch, Diff, Prüfung und Auslieferung deiner Änderung.',
        'Du kannst fachliche Grenzen und benötigte Unterstützung konkret benennen.',
      ],
    },
    media: [
      reading(
        'GitHub: Pull Requests als nachvollziehbare Änderung',
        `${githubDocs}/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests`,
        'Nutze die Review-Fragen für deine Arbeitsprobe. Ein lokaler Entwurf ist eine Vorbereitung und wird ausdrücklich als solcher bezeichnet.',
      ),
    ],
    practiceIds: [],
  },
];
