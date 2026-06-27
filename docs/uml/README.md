# Diagrammes UML — Plateforme DGBE

Diagrammes de conception du système de gestion et de suivi des bourses étudiantes, conformes au cahier des charges (section 9).

## Diagrammes fournis

| # | Diagramme | Source | Image |
|---|-----------|--------|-------|
| 1 | Contexte global | [01-contexte-global.puml](01-contexte-global.puml) | [PNG](png/contexte-global.png) · [SVG](svg/contexte-global.svg) |
| 2 | Cas d'utilisation — Administrateur | [02-cas-utilisation-administrateur.puml](02-cas-utilisation-administrateur.puml) | [PNG](png/cas-administrateur.png) · [SVG](svg/cas-administrateur.svg) |
| 3 | Cas d'utilisation — Agent de traitement | [03-cas-utilisation-agent.puml](03-cas-utilisation-agent.puml) | [PNG](png/cas-agent.png) · [SVG](svg/cas-agent.svg) |
| 4 | Cas d'utilisation — Commission | [04-cas-utilisation-commission.puml](04-cas-utilisation-commission.puml) | [PNG](png/cas-commission.png) · [SVG](svg/cas-commission.svg) |
| 5 | Cas d'utilisation — Service financier | [05-cas-utilisation-service-financier.puml](05-cas-utilisation-service-financier.puml) | [PNG](png/cas-service-financier.png) · [SVG](svg/cas-service-financier.svg) |
| 6 | Cas d'utilisation — Étudiant | [06-cas-utilisation-etudiant.puml](06-cas-utilisation-etudiant.puml) | [PNG](png/cas-etudiant.png) · [SVG](svg/cas-etudiant.svg) |
| 7 | Diagramme de classes complet | [07-diagramme-de-classes.puml](07-diagramme-de-classes.puml) | [PNG](png/diagramme-de-classes.png) · [SVG](svg/diagramme-de-classes.svg) |

> Conformément au cahier des charges, les diagrammes de séquence, d'activité et de déploiement ne sont **pas** générés.

## Régénérer les images

Les images sont produites avec **PlantUML** via le moteur de mise en page **Smetana** (pur Java, sans dépendance Graphviz). Java 17+ requis.

```bash
cd docs/uml
# PNG
java -jar tools/plantuml.jar -tpng -Playout=smetana -o png *.puml
# SVG (vectoriel, recommandé pour l'impression du mémoire)
java -jar tools/plantuml.jar -tsvg -Playout=smetana -o svg *.puml
```

> `tools/plantuml.jar` n'est pas versionné par défaut. Le télécharger si besoin :
> ```bash
> curl -sL -o tools/plantuml.jar \
>   https://repo1.maven.org/maven2/net/sourceforge/plantuml/plantuml/1.2024.8/plantuml-1.2024.8.jar
> ```

## Édition

Les fichiers `.puml` sont éditables avec :
- l'extension **PlantUML** de VS Code (prévisualisation live) ;
- le serveur en ligne <https://www.plantuml.com/plantuml/>.
